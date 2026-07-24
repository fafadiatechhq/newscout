from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_create_article_and_various_models"),
    ]

    operations = [
        migrations.AddField(
            model_name="article",
            name="is_breaking",
            field=models.BooleanField(default=False),
        ),
    ]
