from rest_framework import serializers
from .models import Car, CarImage, Brand, CarModel
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ['id', 'image']


class CarSerializer(serializers.ModelSerializer):
    # Указываем, что эти поля теперь принимают текст при записи
    brand = serializers.CharField(write_only=True)
    car_model_name = serializers.CharField(source='car_model.name', write_only=True)

    # Поля для отображения (оставляем как было для GET запросов)
    brand_display = serializers.CharField(source='car_model.brand.name', read_only=True)
    model_display = serializers.CharField(source='car_model.name', read_only=True)
    images = CarImageSerializer(many=True, read_only=True)

    class Meta:
        model = Car
        fields = [
            'id', 'brand', 'car_model_name', 'brand_display', 'model_display',
            'year', 'price', 'mileage', 'city', 'address', 'description',
            'owner', 'image', 'images', 'created_at'
        ]
        read_only_fields = ['owner', 'created_at']

    def create(self, validated_data):
        # 1. Извлекаем текстовые данные марки и модели
        brand_name = validated_data.pop('brand')
        model_name = validated_data.pop('car_model')['name']  # достаем из вложенного словаря source

        # 2. Находим или создаем Марку
        brand_obj, _ = Brand.objects.get_or_create(name=brand_name)

        # 3. Находим или создаем Модель, привязанную к этой марке
        car_model_obj, _ = CarModel.objects.get_or_create(
            brand=brand_obj,
            name=model_name
        )

        # 4. Назначаем владельца (текущего пользователя)
        validated_data['owner'] = self.context['request'].user

        # 5. Привязываем найденную модель к объекту машины
        validated_data['car_model'] = car_model_obj

        return super().create(validated_data)

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']

class CarModelSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    class Meta:
        model = CarModel
        fields = ['id', 'brand','brand_name', 'name']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Добавляем статус персонала в сам зашифрованный токен (payload)
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Добавляем данные в открытый JSON ответ, чтобы фронт их сразу увидел
        data['is_staff'] = self.user.is_staff
        data['username'] = self.user.username
        return data