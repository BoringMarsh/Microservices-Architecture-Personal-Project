# Generated by Django 4.2.6 on 2023-10-23 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Tables", "0002_alter_record_time"),
    ]

    operations = [
        migrations.AlterField(
            model_name="record",
            name="time",
            field=models.DateTimeField(verbose_name="YYYY-MM-DD HH:MM:SS"),
        ),
    ]
