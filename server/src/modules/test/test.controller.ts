import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) {}

    @Post()
    create(@Body() createTestDto: any) {
        return this.testService.create(createTestDto);
    }

    @Get()
    findAll() {
        return this.testService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.testService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTestDto: any) {
        return this.testService.update(id, updateTestDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.testService.remove(id);
    }
}
