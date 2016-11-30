import * as mongoose from 'mongoose';

export interface ITestModel extends mongoose.Document{
    testUrl?: string,
    numberOfRuns?: number,
    locationDevice?: string,
    connection?: string,
    lastTest?: Date,
    running?: boolean,
    testInterval?: number,
}



const testSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    testUrl: String,
    numberOfRuns: Number,
    locationDevice: String,
    connection: String,
    lastTest: Date,
    running: { type: Boolean, default: false },
    testInterval: Number,
});

export default mongoose.model<ITestModel>('Test', testSchema);

