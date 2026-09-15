from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("companies", "0002_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="company",
            name="owner",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="companies",
                to="users.user",
            ),
        ),
    ]