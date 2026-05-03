from django.contrib import admin
from .models import Brand, CarModel, Car, CarImage

admin.site.register(Brand)
admin.site.register(CarModel)

class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    inlines = [CarImageInline]
    list_display = ('get_brand', 'car_model', 'city', 'year', 'price')
    list_filter = ('car_model__brand', 'city', 'year')

    def get_brand(self, obj):
        return obj.car_model.brand
    get_brand.short_description = 'Марка'