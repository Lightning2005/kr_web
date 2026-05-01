from django.contrib import admin
from .models import Brand, CarModel, Car

admin.site.register(Brand)
admin.site.register(CarModel)

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('car_model', 'get_brand', 'year', 'price')
    list_filter = ('car_model__brand', 'year')

    def get_brand(self, obj):
        return obj.car_model.brand
    get_brand.short_description = 'Марка'