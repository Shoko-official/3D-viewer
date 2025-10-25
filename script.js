// Importer Three.js et les dépendances comme modules ES6
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Éléments DOM
const loadingContainer = document.getElementById('loadingContainer');
const loadingSubtext = document.getElementById('loadingSubtext');
const progressFill = document.getElementById('progressFill');
const retryButton = document.getElementById('retryButton');
const debugModel = document.getElementById('debugModel');
const debugPosition = document.getElementById('debugPosition');
const debugFPS = document.getElementById('debugFPS');
const resetAllBtn = document.getElementById('resetAll');
const autoRotateCheckbox = document.getElementById('autoRotate');
const showGridCheckbox = document.getElementById('showGrid');
const showWireframeCheckbox = document.getElementById('showWireframe');
const bgColorPicker = document.getElementById('bgColor');
const modelItems = document.querySelectorAll('.model-item');
const notification = document.getElementById('notification');
const controlsPanel = document.getElementById('controlsPanel');
const toggleControlsBtn = document.getElementById('toggleControls');
const closeControlsBtn = document.getElementById('closeControls');
const modelsPanel = document.getElementById('modelsPanel');
const toggleModelsBtn = document.getElementById('toggleModels');
const closeModelsBtn = document.getElementById('closeModels');
const helpModal = document.getElementById('helpModal');
const toggleHelpBtn = document.getElementById('toggleHelp');
const closeHelpBtn = document.getElementById('closeHelp');
const screenshotBtn = document.getElementById('screenshot');
const colorPresets = document.querySelectorAll('.color-preset');

// Options de capture d'écran
const screenshotQuality = document.getElementById('screenshotQuality');
const screenshotUI = document.getElementById('screenshotUI');
const screenshotTransparent = document.getElementById('screenshotTransparent');

// Prévisualisation de capture
const screenshotPreview = document.getElementById('screenshotPreview');
const previewImage = document.getElementById('previewImage');
const previewDimensions = document.getElementById('previewDimensions');
const previewSize = document.getElementById('previewSize');
const downloadScreenshot = document.getElementById('downloadScreenshot');
const closePreview = document.getElementById('closePreview');
const shareScreenshot = document.getElementById('shareScreenshot');

// Indicateurs de touches
const keyForward = document.getElementById('keyForward');
const keyLeft = document.getElementById('keyLeft');
const keyBackward = document.getElementById('keyBackward');
const keyRight = document.getElementById('keyRight');

// Variables Three.js
let scene, camera, renderer, controls;
let currentModel = null;
let gridHelper = null;
let clock = new THREE.Clock();
let stats = { fps: 0, frameTime: 0, lastTime: performance.now() };

// Variables pour les contrôles clavier
const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false
};

// Initialiser la scène 3D
function init() {
  // Créer la scène
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a1a);
  
  // Créer la caméra
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(0, 1, 3);
  
  // Créer le renderer
  renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('canvas3d'),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  
  // Ajouter les lumières
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Créer les contrôles
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 10;
  controls.maxPolarAngle = Math.PI / 2;
  
  // Créer la grille
  gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
  gridHelper.visible = false;
  scene.add(gridHelper);
  
  // Initialiser les icônes Lucide
  lucide.createIcons();
  
  // Charger le modèle par défaut
  loadModel('halloween.glb');
  
  // Cacher l'écran de chargement
  setTimeout(() => {
    loadingContainer.classList.add('hidden');
  }, 1000);
  
  // Initialiser les écouteurs d'événements
  initEventListeners();
  
  // Initialiser le composant select personnalisé
  initCustomSelect();
  
  // Démarrer la boucle d'animation
  animate();
}

// Initialiser le composant select personnalisé
function initCustomSelect() {
  const customSelects = document.querySelectorAll('.custom-select');
  
  customSelects.forEach(select => {
    // Supprimer les écouteurs d'événements existants pour éviter les doublons
    const trigger = select.querySelector('.select-trigger');
    const options = select.querySelector('.select-options');
    const optionsList = select.querySelectorAll('.select-option');
    const selectedValue = select.querySelector('.selected-value');
    
    // Cloner les éléments pour supprimer les événements existants
    const newTrigger = trigger.cloneNode(true);
    const newOptions = options.cloneNode(true);
    const newSelectedValue = selectedValue.cloneNode(true);
    
    // Remplacer les anciens éléments
    trigger.parentNode.replaceChild(newTrigger, trigger);
    options.parentNode.replaceChild(newOptions, options);
    selectedValue.parentNode.replaceChild(newSelectedValue, selectedValue);
    
    // Référencer les nouveaux éléments
    const newTriggerRef = select.querySelector('.select-trigger');
    const newOptionsRef = select.querySelector('.select-options');
    const newOptionsListRef = select.querySelectorAll('.select-option');
    const newSelectedValueRef = select.querySelector('.selected-value');
    
    // Ouvrir/fermer le sélecteur
    newTriggerRef.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Fermer les autres sélecteurs ouverts
      customSelects.forEach(otherSelect => {
        if (otherSelect !== select) {
          const otherTrigger = otherSelect.querySelector('.select-trigger');
          const otherOptions = otherSelect.querySelector('.select-options');
          
          otherTrigger.classList.remove('active');
          otherOptions.classList.remove('active');
        }
      });
      
      // Basculer l'état actuel du sélecteur
      newTriggerRef.classList.toggle('active');
      newOptionsRef.classList.toggle('active');
    });
    
    // Sélectionner une option
    newOptionsListRef.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Mettre à jour la valeur sélectionnée
        newSelectedValueRef.textContent = option.textContent;
        
        // Mettre à jour la classe sélectionnée
        newOptionsListRef.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Fermer le sélecteur
        newTriggerRef.classList.remove('active');
        newOptionsRef.classList.remove('active');
        
        // Déclencher un événement de changement pour le select de format
        if (select.id === 'screenshotFormat') {
          const changeEvent = new Event('change', { bubbles: true });
          select.dispatchEvent(changeEvent);
        }
        
        // Charger le modèle sélectionné si c'est le select de modèle
        if (select.id === 'modelSelect') {
          const modelFile = option.getAttribute('data-value');
          loadModel(modelFile);
        }
      });
    });
  });
  
  // Fermer les sélecteurs lors d'un clic à l'extérieur
  document.addEventListener('click', function() {
    customSelects.forEach(select => {
      const trigger = select.querySelector('.select-trigger');
      const options = select.querySelector('.select-options');
      
      trigger.classList.remove('active');
      options.classList.remove('active');
    });
  });
}

// Charger un modèle 3D
function loadModel(modelFile) {
  // Afficher l'écran de chargement
  loadingContainer.classList.remove('hidden');
  loadingSubtext.textContent = `Chargement de ${modelFile}...`;
  progressFill.style.width = '0%';
  
  // Supprimer le modèle actuel
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }
  
  // Créer le loader
  const loader = new GLTFLoader();
  
  // Charger le modèle
  loader.load(
    `glb/${modelFile}`,
    function (gltf) {
      currentModel = gltf.scene;
      
      // Ajuster la taille et la position du modèle
      const box = new THREE.Box3().setFromObject(currentModel);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      
      // Centrer le modèle
      currentModel.position.x = -center.x;
      currentModel.position.y = -center.y;
      currentModel.position.z = -center.z;
      
      // Mettre à jour les informations de débogage
      debugModel.textContent = modelFile;
      
      // Ajouter le modèle à la scène
      scene.add(currentModel);
      
      // Mettre à jour l'élément actif dans la grille
      modelItems.forEach(item => {
        if (item.getAttribute('data-model') === modelFile) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      
      // Mettre à jour le select personnalisé
      const modelSelect = document.getElementById('modelSelect');
      if (modelSelect) {
        const selectedValue = modelSelect.querySelector('.selected-value');
        const options = modelSelect.querySelectorAll('.select-option');
        
        selectedValue.textContent = modelFile;
        
        options.forEach(option => {
          if (option.getAttribute('data-value') === modelFile) {
            option.classList.add('selected');
          } else {
            option.classList.remove('selected');
          }
        });
      }
      
      // Cacher l'écran de chargement
      setTimeout(() => {
        loadingContainer.classList.add('hidden');
      }, 500);
    },
    function (xhr) {
      // Progression du chargement
      const percent = Math.round((xhr.loaded / xhr.total) * 100);
      progressFill.style.width = `${percent}%`;
    },
    function (error) {
      console.error('Erreur lors du chargement du modèle:', error);
      loadingSubtext.textContent = 'Erreur lors du chargement du modèle';
      retryButton.classList.add('visible');
    }
  );
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
  // Redimensionnement de la fenêtre
  window.addEventListener('resize', onWindowResize);
  
  // Contrôles de l'interface
  toggleControlsBtn.addEventListener('click', () => {
    controlsPanel.classList.toggle('active');
    modelsPanel.classList.remove('active');
  });
  
  closeControlsBtn.addEventListener('click', () => {
    controlsPanel.classList.remove('active');
  });
  
  toggleModelsBtn.addEventListener('click', () => {
    modelsPanel.classList.toggle('active');
    controlsPanel.classList.remove('active');
  });
  
  closeModelsBtn.addEventListener('click', () => {
    modelsPanel.classList.remove('active');
  });
  
  toggleHelpBtn.addEventListener('click', () => {
    helpModal.classList.add('active');
  });
  
  closeHelpBtn.addEventListener('click', () => {
    helpModal.classList.remove('active');
  });
  
  // Fermer les modals en cliquant à l'extérieur
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      helpModal.classList.remove('active');
    }
  });
  
  screenshotPreview.addEventListener('click', (e) => {
    if (e.target === screenshotPreview) {
      screenshotPreview.classList.remove('active');
    }
  });
  
  // Options de contrôle
  autoRotateCheckbox.addEventListener('change', () => {
    controls.autoRotate = autoRotateCheckbox.checked;
  });
  
  showGridCheckbox.addEventListener('change', () => {
    gridHelper.visible = showGridCheckbox.checked;
  });
  
  showWireframeCheckbox.addEventListener('change', () => {
    if (currentModel) {
      currentModel.traverse((child) => {
        if (child.isMesh) {
          child.material.wireframe = showWireframeCheckbox.checked;
        }
      });
    }
  });
  
  bgColorPicker.addEventListener('change', () => {
    scene.background = new THREE.Color(bgColorPicker.value);
  });
  
  colorPresets.forEach(preset => {
    preset.addEventListener('click', () => {
      const color = preset.getAttribute('data-color');
      bgColorPicker.value = color;
      scene.background = new THREE.Color(color);
    });
  });
  
  resetAllBtn.addEventListener('click', resetAll);
  
  // Sélection de modèle
  modelItems.forEach(item => {
    item.addEventListener('click', () => {
      const modelFile = item.getAttribute('data-model');
      loadModel(modelFile);
    });
  });
  
  // Capture d'écran
  screenshotBtn.addEventListener('click', takeScreenshot);
  screenshotQuality.addEventListener('input', updateQualityValue);
  downloadScreenshot.addEventListener('click', downloadScreenshotImage);
  closePreview.addEventListener('click', () => {
    screenshotPreview.classList.remove('active');
  });
  
  // Bouton de réessai
  retryButton.addEventListener('click', () => {
    const currentModelFile = debugModel.textContent;
    loadModel(currentModelFile);
    retryButton.classList.remove('visible');
  });
  
  // Contrôles clavier
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  
  // Partage de capture d'écran
  shareScreenshot.addEventListener('click', shareScreenshotImage);
}

// Redimensionnement de la fenêtre
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Ajuster la position de la caméra en fonction de la taille de l'écran
  checkScreenSize();
}

// Vérifier la taille de l'écran et ajuster la caméra
function checkScreenSize() {
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  
  // Ajuster la caméra en fonction de la taille de l'écran
  if (isMobile) {
    camera.position.set(0, 1, 5);
  } else if (isTablet) {
    camera.position.set(0, 1, 4);
  } else {
    camera.position.set(0, 1, 3);
  }
  
  // Ajuster la taille des panneaux
  if (modelsPanel && modelsPanel.classList.contains('active')) {
    if (isMobile) {
      modelsPanel.style.height = '50vh';
    } else {
      modelsPanel.style.height = '';
    }
  }
  
  if (controlsPanel && controlsPanel.classList.contains('active')) {
    if (isMobile) {
      controlsPanel.style.height = '60vh';
    } else {
      controlsPanel.style.height = '';
    }
  }
}

// Réinitialiser tous les paramètres
function resetAll() {
  // Réinitialiser la caméra
  camera.position.set(0, 1, 3);
  camera.lookAt(0, 0, 0);
  controls.reset();
  
  // Réinitialiser les options
  autoRotateCheckbox.checked = false;
  controls.autoRotate = false;
  
  showGridCheckbox.checked = false;
  gridHelper.visible = false;
  
  showWireframeCheckbox.checked = false;
  if (currentModel) {
    currentModel.traverse((child) => {
      if (child.isMesh) {
        child.material.wireframe = false;
      }
    });
  }
  
  bgColorPicker.value = '#0a0a1a';
  scene.background = new THREE.Color(0x0a0a1a);
  
  // Afficher une notification
  showNotification('Paramètres réinitialisés');
}

// Prendre une capture d'écran
function takeScreenshot() {
  // Sauvegarder les paramètres actuels
  const originalBackground = scene.background.clone();
  const originalUIVisible = !document.querySelector('.ui-overlay').style.display;
  
  // Appliquer les options de capture d'écran
  if (screenshotTransparent.checked) {
    scene.background = null;
  }
  
  if (!screenshotUI.checked) {
    document.querySelector('.ui-overlay').style.display = 'none';
  }
  
  // Rendre la scène
  renderer.render(scene, camera);
  
  // Obtenir les données de l'image
  // Récupérer la valeur du select personnalisé
  const formatSelect = document.getElementById('screenshotFormat');
  const selectedOption = formatSelect.querySelector('.select-option.selected');
  const formatValue = selectedOption.getAttribute('data-value');
  
  const dataURL = renderer.domElement.toDataURL(
    `image/${formatValue}`,
    parseFloat(screenshotQuality.value)
  );
  
  // Restaurer les paramètres originaux
  scene.background = originalBackground;
  if (originalUIVisible) {
    document.querySelector('.ui-overlay').style.display = '';
  }
  
  // Afficher la prévisualisation
  previewImage.src = dataURL;
  
  // Calculer les dimensions et la taille
  const img = new Image();
  img.onload = function() {
    previewDimensions.textContent = `${img.width} × ${img.height}`;
    
    // Estimer la taille du fichier
    const base64Length = dataURL.length - (dataURL.indexOf(',') + 1);
    const padding = dataURL.charAt(dataURL.length - 2) === '=' ? 
      (dataURL.charAt(dataURL.length - 1) === '=' ? 2 : 1) : 0;
    const fileSize = (base64Length * 0.75) - padding;
    
    if (fileSize < 1024) {
      previewSize.textContent = `${fileSize.toFixed(2)} B`;
    } else if (fileSize < 1024 * 1024) {
      previewSize.textContent = `${(fileSize / 1024).toFixed(2)} KB`;
    } else {
      previewSize.textContent = `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
    }
  };
  img.src = dataURL;
  
  // Afficher le modal de prévisualisation
  screenshotPreview.classList.add('active');
  
  // Initialiser les sélecteurs personnalisés dans le modal après un court délai
  // pour s'assurer que le modal est complètement affiché
  setTimeout(() => {
    initCustomSelect();
  }, 100);
}

// Mettre à jour la valeur de qualité
function updateQualityValue() {
  const value = Math.round(parseFloat(screenshotQuality.value) * 100);
  document.getElementById('qualityValue').textContent = `${value}%`;
}

// Télécharger la capture d'écran
function downloadScreenshotImage() {
  // Récupérer la valeur du select personnalisé
  const formatSelect = document.getElementById('screenshotFormat');
  const selectedOption = formatSelect.querySelector('.select-option.selected');
  const formatValue = selectedOption.getAttribute('data-value');
  
  const link = document.createElement('a');
  link.href = previewImage.src;
  link.download = `3d-model-${debugModel.textContent.replace('.glb', '')}.${formatValue}`;
  link.click();
}

// Partager la capture d'écran
function shareScreenshotImage() {
  // Convertir l'image en blob
  fetch(previewImage.src)
    .then(res => res.blob())
    .then(blob => {
      // Vérifier si l'API Web Share est disponible
      if (navigator.share && navigator.canShare({ files: [new File([blob], '3d-model.png', { type: 'image/png' })] })) {
        // Partager avec l'API Web Share
        navigator.share({
          title: 'Modèle 3D',
          text: `Regarde ce modèle 3D: ${debugModel.textContent}`,
          files: [new File([blob], '3d-model.png', { type: 'image/png' })]
        })
        .catch(err => console.error('Erreur lors du partage:', err));
      } else {
        // Fallback: copier dans le presse-papiers
        navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ])
        .then(() => {
          showNotification('Image copiée dans le presse-papiers');
        })
        .catch(err => {
          console.error('Erreur lors de la copie:', err);
          showNotification('Impossible de partager l\'image');
        });
      }
    });
}

// Afficher une notification
function showNotification(message) {
  const notificationMessage = document.querySelector('.notification-message');
  notificationMessage.textContent = message;
  
  notification.classList.add('active');
  
  setTimeout(() => {
    notification.classList.remove('active');
  }, 3000);
}

// Gestion des touches du clavier - MODIFIÉ
function onKeyDown(event) {
  switch (event.code) {
    case 'KeyZ': // Monter
      keys.forward = true;
      keyForward.classList.add('active');
      break;
    case 'KeyQ': // Gauche
      keys.left = true;
      keyLeft.classList.add('active');
      break;
    case 'KeyS': // Descendre
      keys.backward = true;
      keyBackward.classList.add('active');
      break;
    case 'KeyD': // Droite
      keys.right = true;
      keyRight.classList.add('active');
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case 'KeyZ': // Monter
      keys.forward = false;
      keyForward.classList.remove('active');
      break;
    case 'KeyQ': // Gauche
      keys.left = false;
      keyLeft.classList.remove('active');
      break;
    case 'KeyS': // Descendre
      keys.backward = false;
      keyBackward.classList.remove('active');
      break;
    case 'KeyD': // Droite
      keys.right = false;
      keyRight.classList.remove('active');
      break;
  }
}

// Mettre à jour la position de la caméra en fonction des touches - MODIFIÉ
function updateCameraPosition() {
  const moveSpeed = 0.1;
  
  if (keys.forward) { // Z - Monter
    camera.position.y += moveSpeed;
  }
  if (keys.backward) { // S - Descendre
    camera.position.y -= moveSpeed;
  }
  if (keys.left) { // Q - Gauche
    camera.translateX(-moveSpeed);
  }
  if (keys.right) { // D - Droite
    camera.translateX(moveSpeed);
  }
  
  // Mettre à jour la position dans le débogage
  const pos = camera.position;
  debugPosition.textContent = `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`;
}

// Boucle d'animation
function animate() {
  requestAnimationFrame(animate);
  
  // Mettre à jour les contrôles
  controls.update();
  
  // Mettre à jour la position de la caméra
  updateCameraPosition();
  
  // Calculer les FPS
  const currentTime = performance.now();
  const deltaTime = currentTime - stats.lastTime;
  
  if (deltaTime >= 1000) {
    stats.fps = Math.round((stats.frameTime * 1000) / deltaTime);
    debugFPS.textContent = stats.fps;
    stats.frameTime = 0;
    stats.lastTime = currentTime;
  }
  
  stats.frameTime++;
  
  // Rendre la scène
  renderer.render(scene, camera);
}

// Initialiser l'application
init();