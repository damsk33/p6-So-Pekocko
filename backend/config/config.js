const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
    process.env.MONGO_URL = 'mongodb+srv://damsk33:Justmarried90&@cluster0.c2vpu.mongodb.net/<dbname>?retryWrites=true&w=majority';
}
process.env.JWT_SECRET = process.env.JWT_SECRET || 'SECRETJWTM2';
process.env.JWT_EXP = process.env.JWT_EXP || '1h';