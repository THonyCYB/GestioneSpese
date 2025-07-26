-- Script per inizializzare il database MongoDB
-- Questo script può essere eseguito tramite MongoDB Compass o mongosh

-- Crea la collezione users con validazione
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Email deve essere una stringa valida"
        },
        password: {
          bsonType: "string",
          minLength: 6,
          description: "Password deve essere almeno 6 caratteri"
        }
      }
    }
  }
});

-- Crea indice unico per email
db.users.createIndex({ "email": 1 }, { unique: true });

-- Crea la collezione expenses con validazione
db.createCollection("expenses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "amount", "category", "date", "userId"],
      properties: {
        title: {
          bsonType: "string",
          maxLength: 100,
          description: "Titolo deve essere una stringa di max 100 caratteri"
        },
        amount: {
          bsonType: "number",
          minimum: 0.01,
          description: "Importo deve essere maggiore di 0"
        },
        category: {
          bsonType: "string",
          enum: ["Alimentari", "Trasporti", "Intrattenimento", "Salute", "Casa", "Lavoro", "Altro"],
          description: "Categoria deve essere una delle opzioni valide"
        },
        date: {
          bsonType: "date",
          description: "Data deve essere un oggetto Date valido"
        },
        userId: {
          bsonType: "objectId",
          description: "userId deve essere un ObjectId valido"
        }
      }
    }
  }
});

-- Crea indici per migliorare le performance
db.expenses.createIndex({ "userId": 1, "date": -1 });
db.expenses.createIndex({ "userId": 1, "category": 1 });
db.expenses.createIndex({ "createdAt": 1 });

-- Inserisci dati di esempio (opzionale)
-- Nota: Questi dati sono solo per test, rimuovere in produzione

print("Database setup completato!");
print("Collezioni create: users, expenses");
print("Indici creati per ottimizzare le query");
