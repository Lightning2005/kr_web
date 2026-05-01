from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Car
from .serializers import CarSerializer
from .filters import CarFilter

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CarFilter