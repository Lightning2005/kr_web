from django.db import models

class Car(models.Model):
    brand = models.CharField(max_length=50, verbose_name="Марка")
    model_name = models.CharField(max_length=100, verbose_name="Модель")
    year = models.PositiveIntegerField(verbose_name="Год выпуска")
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Цена")
    mileage = models.PositiveIntegerField(verbose_name="Пробег (км)")
    description = models.TextField(blank=True, verbose_name="Описание")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")

    def __str__(self):
        return f"{self.brand} {self.model_name} ({self.year})"

    class Meta:
        verbose_name = "Автомобиль"
        verbose_name_plural = "Автомобили"