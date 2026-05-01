from django_filters import rest_framework as filters
from .models import Car


class CarFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')

    class Meta:
        model = Car
        fields = ['car_model__brand', 'car_model', 'year']