export default class Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement) {
    this.possesseur = possesseur;
    this.libelle = libelle;
    this.valeur = valeur;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.tauxAmortissement = tauxAmortissement;
  }

  getValeur(date) {
    return this.getValeurApresAmortissement(this.valeur, this.dateDebut.tauxAmortissement, this.dateDebut, date);
  }

  getValeurApresAmortissement(valeur, tauxAmortissement, dateDebut, dateActuelle) {
    if (dateActuelle < dateDebut) {
      return 0;
    }
    const differenceDate = {
      year: dateActuelle.getFullYear() - dateDebut.getFullYear(),
      month: dateActuelle.getMonth() - dateDebut.getMonth(),
      day: dateActuelle.getDate() - dateDebut.getDate(),
    };
  
    var raison = differenceDate.year + differenceDate.month / 12 + differenceDate.day / 365;

    const result = valeur - valeur *(raison * tauxAmortissement / 100);
    return result;
  }
}
