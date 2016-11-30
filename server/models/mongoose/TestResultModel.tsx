import * as mongoose from 'mongoose';

export interface ITestResultModel extends mongoose.Document {
    wptUrl?: string,
    startDate?: Date,
    finishDate?: Date,
    ttfb?: number,
    startRender?: number,
    speedIndex?: number,
    loadTime?: number,
    totalSize?: number,
}

const testResultSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId}, 
    wptUrl: String,
    startDate: Date,
    finishDate: Date,
    ttfb: Number,
    startRender: Number,
    speedIndex: Number,
    loadTime: Number,
    totalSize: Number
})

export default mongoose.model<ITestResultModel>('TestResult', testResultSchema)