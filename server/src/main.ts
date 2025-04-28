import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import * as hbs from 'express-handlebars';
import { ExpiredFilter } from 'modules/auth/jwt-auth.filter';
import { LoggingService } from 'modules/log/logging.service';
import { join } from 'path';
import { ExtendedCache } from 'types';
import { AppModule } from './modules/app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS
    app.enableCors({
        origin: '*', // Allow all origins (you can specify specific origins here)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    app.use(
        [
            process.env.SWAGGER_ENDPOINT
                ? `/${process.env.SWAGGER_ENDPOINT}`
                : '/api-docs',
        ],
        basicAuth({
            challenge: true,
            users: {
                [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS,
            },
        }),
    );
    const config = new DocumentBuilder()
        .setTitle('Ecommerce API')
        .setDescription('The Ecommerce API description')
        .setVersion('1.0')
        .addTag('Ecommerce')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(
        process.env.SWAGGER_ENDPOINT || 'api-docs',
        app,
        document,
    );

    const cacheManager = app.get<ExtendedCache>(CACHE_MANAGER);
    const loggingService = app.get<LoggingService>(LoggingService);

    app.useGlobalFilters(new ExpiredFilter(cacheManager, loggingService));

    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.engine(
        'hbs',
        hbs.engine({
            extname: 'hbs',
            layoutsDir: join(__dirname, '..', 'views/layouts'),
            partialsDir: join(__dirname, '..', 'views/partials'),
            defaultLayout: 'main',
            helpers: {
                // Define 'extend' helper
                extend: function (name, context) {
                    if (!this.blocks) this.blocks = {};
                    if (!this.blocks[name]) this.blocks[name] = [];
                    this.blocks[name].push(context.fn(this));
                },
                // Define 'block' helper
                block: function (name) {
                    const val = (this.blocks && this.blocks[name]) || [];
                    return val.join('\n');
                },
                // Define 'content' helper
                content: function (name, context) {
                    if (!this.blocks) this.blocks = {};
                    const block = this.blocks[name];
                    const content = block
                        ? block.join('\n')
                        : context.fn
                          ? context.fn(this)
                          : '';
                    return content;
                },
            },
        }),
    );

    // Set Handlebars as the view engine
    app.setViewEngine('hbs');

    // Serve static assets
    app.useStaticAssets(join(__dirname, '..', 'public'));

    await app.listen(parseInt(process.env.PORT) || 3010);
}
bootstrap();
