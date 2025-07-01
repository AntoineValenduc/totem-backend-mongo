db = db.getSiblingDB("totemDB");

db.createUser({
  user: "totem_user",
  pwd: "totem_pass",
  roles: [
    {
      role: "readWrite",
      db: "totemDB"
    }
  ]
});

//Initiation Branche
db.createCollection("branches");
db.branches.insertOne({
  name: "Pionniers",
  color: "Rouge",
  is_active: true,
  created_at: new Date()
});

db.branches.insertOne({
  name: "Scout",
  color: "Bleu",
  created_at: new Date()
});

db.branches.insertOne({
  name: "Louveteau",
  color: "Orange",
  created_at: new Date()
});

db.branches.insertOne({
  name: "Compagnon",
  color: "Vert",
  created_at: new Date()
});
