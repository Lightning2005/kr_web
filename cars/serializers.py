from rest_framework import serializers
from .models import Car

class CarSerializer(serializers.ModelSerializer):
    brand = serializers.CharField(source='car_model.brand.name', read_only=True)
    model_name = serializers.CharField(source='car_model.name', read_only=True)

    class Meta:
        model = Car
        # Убедись, что 'owner' есть в списке fields
        fields = ['id', 'brand', 'model_name', 'car_model', 'year', 'price', 'mileage', 'description', 'owner',
                  'created_at']

        # Делаем поле 'owner' только для чтения
        extra_kwargs = {
            'owner': {'read_only': True}
        }