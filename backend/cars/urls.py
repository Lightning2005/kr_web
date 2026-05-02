from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, BrandViewSet, CarModelViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet)
router.register(r'brands', BrandViewSet)
router.register(r'carmodels', CarModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]