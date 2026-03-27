const mongoose = require("mongoose");
const url = require("./connection");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];


mongoose.set("strictQuery", false);
mongoose.connect(url(password), { family: 4 });


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema);

const newPerson = new Person({
    name: name,
    number: number
})


if(process.argv.length === 5) {
    newPerson.save().then(person => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    });
} else if(process.argv.length === 3) {
    Person.find({}).then(persons => {
        console.log("phonebook:")
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close();
    })
} else {
    console.log("invalid arguments");
    process.exit(1);
}
