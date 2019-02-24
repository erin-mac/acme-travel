const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL)

const User = db.define('user', {
    name: Sequelize.STRING
});

const Hotel = db.define('hotel', {
    hotel: Sequelize.STRING
});

const Stay = db.define('stay', {
    days: Sequelize.INTEGER
});

Stay.belongsTo(User);
Stay.belongsTo(Hotel);
User.hasMany(Stay)
//Hotel.belongsTo(User);
//User.hasMany(Hotel, { foreignKey: 'hotelID' });

const syncAndSeed = () => {
    return db.sync({ force: true })
        .then(async () => {
            const [moe, larry, curly] = await Promise.all([
                User.create({ name: 'moe' }),
                User.create({ name: 'larry' }),
                User.create({ name: 'curly' })
            ]);
            const [Hilton, Sheraton] = await Promise.all([
                Hotel.create({ hotel: 'Hilton' }),
                Hotel.create({ hotel: 'Sheraton' })
            ]);
            await Promise.all([
                Stay.create({ userId: moe.id, hotelId: Sheraton.id, days: 4 }),
                Stay.create({ userId: moe.id, hotelId: Sheraton.id, days: 3 }),
                Stay.create({ userId: moe.id, hotelId: Hilton.id, days: 5 }),
                Stay.create({ userId: larry.id, hotelId: Sheraton.id, days: 19 }),
                Stay.create({ userId: curly.id, hotelId: Sheraton.id, days: 4 }),
                Stay.create({ userId: curly.id, hotelId: Hilton.id, days: 5 })
            ])
                .then(() => {
                    return User.findOne({
                        where: { name: 'moe' },
                        include: [Stay]
                    })
                })
                .then(moe => {
                    //console.log(moe.get())
                })
        })
}

module.exports = {
    db,
    User,
    Hotel,
    Stay,
    syncAndSeed
}

