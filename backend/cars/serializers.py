from rest_framework import serializers
from .models import Car, CarImage, Brand, CarModel
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ['id', 'image']


class CarSerializer(serializers.ModelSerializer):
    brand = serializers.CharField(write_only=True)
    car_model_name = serializers.CharField(source='car_model.name', write_only=True)

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

    def _get_or_create_car_model(self, brand_name, model_name):
        brand_obj, _ = Brand.objects.get_or_create(name=brand_name)
        car_model_obj, _ = CarModel.objects.get_or_create(brand=brand_obj, name=model_name)
        return car_model_obj

    def create(self, validated_data):
        brand_name = validated_data.pop('brand')
        model_name = validated_data.pop('car_model')['name']
        validated_data['car_model'] = self._get_or_create_car_model(brand_name, model_name)
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Если в запросе пришли бренд и модель, обновляем связь
        brand_name = validated_data.pop('brand', None)
        model_data = validated_data.pop('car_model', None)

        if brand_name and model_data:
            model_name = model_data.get('name')
            instance.car_model = self._get_or_create_car_model(brand_name, model_name)

        return super().update(instance, validated_data)

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