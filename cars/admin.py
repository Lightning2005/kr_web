from django.contrib import admin
from .models import Car

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('brand', 'model_name', 'year', 'price')
    list_filter = ('brand', 'year')
    search_fields = ('brand', 'model_name')