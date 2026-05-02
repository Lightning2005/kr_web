from rest_framework import serializers
from .models import Car, CarImage, Brand, CarModel

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
                  'mileage', 'description', 'owner', 'image', 'images', 'created_at']
        read_only_fields = ['owner', 'created_at']
        extra_kwargs = {
            'owner': {'read_only': True}
        }

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']

class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModel
        fields = ['id', 'brand', 'name']