from rest_framework import serializers
from .models import Car, CarImage, Brand, CarModel
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ['id', 'image']

class CarSerializer(serializers.ModelSerializer):
    brand = serializers.CharField(source='car_model.brand.name', read_only=True)
    model_name = serializers.CharField(source='car_model.name', read_only=True)
    images = CarImageSerializer(many=True, read_only=True)

    class Meta:
        model = Car
        fields = ['id', 'brand', 'model_name', 'car_model', 'year', 'price',
                  'mileage', 'city', 'address', 'description', 'owner', 'image', 'images', 'created_at']
        read_only_fields = ['owner', 'created_at']
        extra_kwargs = {
            'owner': {'read_only': True}
        }

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