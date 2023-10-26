# Generated by Django 4.2.6 on 2023-10-26 04:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Tables', '0009_alter_record_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alpha2code', models.CharField(max_length=4)),
                ('alpha3code', models.CharField(max_length=4)),
                ('shortname', models.CharField(max_length=30)),
                ('fullname', models.CharField(max_length=100)),
                ('flag_url', models.CharField(max_length=256)),
            ],
        ),
    ]
