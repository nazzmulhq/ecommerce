import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestDocument } from './entities/test.entity';

@Injectable()
export class TestService {
    constructor(
        @InjectModel(Test.name) private testModel: Model<TestDocument>,
    ) {}

    async create(createTestDto: any): Promise<Test> {
        const createdTest = new this.testModel(createTestDto);
        return createdTest.save();
    }

    async findAll(): Promise<Test[]> {
        return this.testModel.find().exec();
    }

    async findOne(id: string): Promise<Test> {
        return this.testModel.findById(id).exec();
    }

    async update(id: string, updateTestDto: any): Promise<Test> {
        return this.testModel
            .findByIdAndUpdate(id, updateTestDto, { new: true })
            .exec();
    }

    async remove(id: string): Promise<Test> {
        return this.testModel.findByIdAndDelete(id).exec();
    }
}
