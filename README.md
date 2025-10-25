

Voici une version améliorée du README pour votre projet de visualiseur 3D :

# Visualiseur 3D - Modèles GLB

Un visualiseur 3D moderne et interactif pour afficher des modèles GLB avec des contrôles avancés et une interface utilisateur élégante.

![Capture d'écran](https://via.placeholder.com/800x450?text=Visualiseur+3D+Screenshot)

## 🚀 Démarrage Rapide

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Python 3 (pour le serveur local)

### Installation et Lancement

1. **Téléchargez le code** et placez-le dans un dossier sur votre ordinateur

2. **Ouvrez un terminal** et naviguez vers le dossier du projet :
   ```bash
   cd C:\Users\<ton_username>\Downloads\3d
   # ou
   cd /chemin/vers/votre/dossier/3d
   ```

3. **Lancez un serveur local** avec Python :
   ```bash
   python -m http.server 8000
   ```

4. **Ouvrez votre navigateur** et accédez à l'application :
   ```
   http://localhost:8000
   ```

## 🎮 Fonctionnalités

### Contrôles Intuitifs
- **Souris** :
  - Clic gauche + glisser : Faire pivoter la vue
  - Molette : Zoomer avant/arrière
  - Clic droit + glisser : Monter/descendre la vue
  - Clic central + glisser : Déplacer latéralement

- **Clavier (ZQSD)** :
  - Z : Avancer
  - Q : Gauche
  - S : Reculer
  - D : Droite

### 📸 Capture d'Écran Professionnelle
- **Qualité réglable** : Standard, Haute qualité (2x), Ultra HD (4x)
- **Formats multiples** : PNG, JPG, WebP
- **Options d'apparence** :
  - Inclure ou exclure l'interface
  - Fond transparent optionnel
- **Prévisualisation avant téléchargement**
- **Partage natif** si supporté par le navigateur

### Personnalisation Avancée
- Changement de couleur d'arrière-plan avec presets
- Affichage/masquage de la grille
- Mode fil de fer
- Rotation automatique de la caméra
- Réinitialisation de la vue

### Interface Moderne
- Design épuré avec effets de flou d'arrière-plan
- Animations fluides et transitions
- Indicateurs visuels des touches actives
- Informations de débogage en temps réel (FPS, position)
- Notifications non-intrusives

## 🛠 Technologies Utilisées

- **Three.js** : Bibliothèque 3D pour le rendu des modèles
- **GLTFLoader** : Pour charger les modèles GLB/GLTF
- **OrbitControls** : Pour les contrôles de caméra
- **HTML5 & CSS3** : Structure et style de l'interface
- **JavaScript ES6** : Logique de l'application
- **Lucide Icons** : Icônes modernes pour l'interface

## Structure des Fichiers

```
├── glb/                    # Dossier pour les modèles 3D
│   ├── modele1.glb
│   ├── modele2.glb
│   └── ...
├── 3d.html                 # Fichier HTML principal
├── script.js               # Logique JavaScript
├── style.css               # Feuille de style CSS
└── README.md               # Ce fichier
```

## Ajouter de Nouveaux Modèles

### Méthode 1 : Fichiers Locaux
1. Placez votre fichier GLB dans le dossier `glb/`
2. Ajoutez une entrée dans la liste des modèles dans `3d.html` :
   ```html
   <div class="model-item" data-model="votre_modele.glb">
     <div class="model-icon">
       <i data-lucide="box"></i>
     </div>
     <div class="model-info">
       <div class="model-name">Nom du Modèle</div>
       <div class="model-size">Taille du fichier</div>
     </div>
   </div>
   ```

### Méthode 2 : URL Externes
Vous pouvez également utiliser des modèles hébergés en ligne en utilisant une URL complète :
```html
<div class="model-item" data-model="https://exemple.com/chemin/vers/modele.glb">
  <!-- ... -->
</div>
```

## Capture d'Écran Avancée

La fonctionnalité de capture d'écran offre des options professionnelles :

1. **Qualité** :
   - Standard : Résolution native de votre écran
   - Haute qualité : 2x la résolution native
   - Ultra HD : 4x la résolution native (idéal pour l'impression)

2. **Format** :
   - PNG : Sans perte de qualité, support de la transparence
   - JPG : Compression avec perte, fichiers plus petits
   - WebP : Format moderne, meilleure compression

3. **Options** :
   - Inclure l'interface : Capture avec ou sans l'UI
   - Fond transparent : Supprime l'arrière-plan pour un fond transparent

## Dépannage

### Problèmes Courants

**Question : Les modèles ne se chargent pas**
- Vérifiez que les fichiers GLB sont bien dans le dossier `glb/`
- Assurez-vous que le serveur local est bien lancé
- Vérifiez la console du navigateur pour d'éventuelles erreurs

**Question : Les captures d'écran sont noires**
- Essayez de désactiver l'option "Fond transparent"
- Vérifiez que votre navigateur supporte WebGL

**Question : L'interface est lente**
- Fermez d'autres onglets ou applications gourmandes en ressources
- Essayez de réduire la qualité des captures d'écran

### Erreurs Connues
- Erreur "Request for font blocked" : C'est une erreur mineure liée aux polices, elle n'affecte pas le fonctionnement de l'application
- Erreur "Jeu de règles ignoré" : Erreur CSS mineure qui n'impacte pas l'expérience utilisateur

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités

## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.