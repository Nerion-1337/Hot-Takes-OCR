const SauceModel = require("../models/sauce");
const fs = require("fs");

exports.allSauce = (req, res) => {
//    
  SauceModel.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};
//
//
//selectionner une sauce pour new page
//
exports.selectSauce = (req, res) => {
//
  SauceModel.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
//
//
// ajouter une sauce
//
exports.addSauce = (req, res) => {
//
//contient le renvoie des données inputs du front
  const SauceObject = JSON.parse(req.body.sauce);
  //supprimer id car utilisateur peut transmettre celui d'un autre, récupérer celui du token
  //delete SauceObject._id;
  delete SauceObject.userId;
  const sauce = new SauceModel({
    ...SauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/image/${req.file.filename}`,
  });

  sauce.save()
    .then(() => {res.status(201).json({ message: "Sauce Ajouté !" });})
    .catch((error) => {res.status(400).json({ error });});
};
//
//
//modifier sauce
//
exports.putSauce = (req, res) => {
//
// contient l'id de l'objet attribué par le serveur
  const objectID = req.params.id;

  const SauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/image/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  //sécurité pour éviter que la personne ayant bien créer l'article, en le modifiant ne l'attribue a quelqu'un d'autre.
  delete SauceObject.userId;

  SauceModel.findOne({ _id: objectID })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        SauceModel.updateOne(
          { _id: objectID },
          { ...SauceObject, _id: objectID }
        )
          .then(() => res.status(200).json({ message: "Sauce Modifiée" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
//
//
//supprimer sauce selectionné
//
exports.deleteSauce = (req, res) => {
    //
  SauceModel.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        const filename = sauce.imageUrl.split("/image/")[1];
        fs.unlink(`image/${filename}`, () => {
          SauceModel.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

//
//
//Ajouter/supprimer des like/dislike
//
exports.like = (req, res) => {
//
  const userId = req.auth.userId;
  const like = req.body.like;

  // Chercher la sauce correspondante dans la base de données
  SauceModel.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si l'utilisateur aime la sauce
      if (like === 1) {
        // Si l'utilisateur n'a pas déjà aimé la sauce
        if (!sauce.usersLiked.includes(userId)) {
          sauce.usersLiked.push(userId);
          sauce.likes++;
        }
        // Si l'utilisateur n'aime pas la sauce
      } else if (like === -1) {
        // Si l'utilisateur n'a pas déjà disliké la sauce
        if (!sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked.push(userId);
          sauce.dislikes++;
        }
        // Si l'utilisateur souhaite enlever son like ou dislike
      } else if (like === 0) {
        // Si l'utilisateur avait aimé la sauce
        if (sauce.usersLiked.includes(userId)) {
          const index = sauce.usersLiked.indexOf(userId);
          sauce.usersLiked.splice(index, 1);
          sauce.likes--;
          // Si l'utilisateur avait disliké la sauce
        } else if (sauce.usersDisliked.includes(userId)) {
          const index = sauce.usersDisliked.indexOf(userId);
          sauce.usersDisliked.splice(index, 1);
          sauce.dislikes--;
        }
      }
      sauce.save()
        .then(() => res.status(200).json({ message: "Like mis à jour !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};
