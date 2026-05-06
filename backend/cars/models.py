import os
from django.db import models
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.db.models.signals import post_delete, pre_save
from django.contrib.auth.models import User

# 1. Сначала объявляем вспомогательные функции
def validate_image_size(fieldfile_obj):
    filesize = fieldfile_obj.size
    megabyte_limit = 2.0
    if filesize > megabyte_limit * 1024 * 1024:
        raise ValidationError(f"Максимальный размер файла {megabyte_limit}MB")

# 2. Модели справочников
class Brand(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name="Марка")

    class Meta:
        verbose_name = "Марка"
        verbose_name_plural = "Марки"

    def __str__(self):
        return self.name

class CarModel(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='models', verbose_name="Марка")
    name = models.CharField(max_length=100, verbose_name="Модель")

    class Meta:
        verbose_name = "Модель автомобиля"
        verbose_name_plural = "Модели автомобилей"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Авто-очистка: убираем название марки из начала названия модели
        brand_prefix = self.brand.name.lower()
        if self.name.lower().startswith(brand_prefix):
            self.name = self.name[len(brand_prefix):].strip()
        super().save(*args, **kwargs)

# 3. Основная модель автомобиля
class Car(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cars', verbose_name="Сотрудник")
    car_model = models.ForeignKey(CarModel, on_delete=models.PROTECT, verbose_name="Модель")
    year = models.PositiveIntegerField(verbose_name="Год выпуска")
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Цена")
    mileage = models.PositiveIntegerField(verbose_name="Пробег (км)")
    city = models.CharField(
        max_length=100,
        default="Москва",
        verbose_name="Город"
    )
    address = models.CharField(
        max_length=255,
        default="ул. Тверская, 1",
        verbose_name="Адрес осмотра"
    )
    description = models.TextField(blank=True, verbose_name="Описание")
    image = models.ImageField(
        upload_to='cars_photos/',
        blank=True,
        null=True,
        verbose_name="Фотография",
        validators=[validate_image_size]
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")

    def __str__(self):
        return f"{self.car_model.brand.name} {self.car_model.name} ({self.year})"

    class Meta:
        verbose_name = "Автомобиль"
        verbose_name_plural = "Автомобили"

# 4. Галерея
class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images', verbose_name="Автомобиль")
    image = models.ImageField(
        upload_to='cars_photos/gallery/',
        verbose_name="Доп. фото",
        validators=[validate_image_size]
    )

    class Meta:
        verbose_name = "Фотография галереи"
        verbose_name_plural = "Фотографии галереи"

# 5. Сигналы для удаления файлов
@receiver(post_delete, sender=CarImage)
def delete_car_image_on_delete(sender, instance, **kwargs):
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)

@receiver(post_delete, sender=Car)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

@receiver(pre_save, sender=Car)
def auto_delete_file_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_file = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return False
    new_file = instance.image
    if not old_file == new_file:
        if old_file and os.path.isfile(old_file.path):
            os.remove(old_file.path)