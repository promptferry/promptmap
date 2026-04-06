import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  X,
  GripVertical,
  Zap,
  ImageIcon,
  Circle,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Layers,
  FileSpreadsheet,
  Download,
  Target,
  Maximize2,
  Dices,
  ExternalLink,
  Ban,
  Info,
  Languages,
  Loader2,
  Film,
  Video,
  Pencil,
  Camera,
  Clock,
  Palette,
  Share2,
  FileImage,
  Link,
  Database,
  Save,
  Star,
  Folder,
  FolderPlus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Trash,
  Search
} from 'lucide-react';
import { domToDataUrl } from 'modern-screenshot';

// Import dnd-kit components
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Using the 'xlsx' library for robust Excel file export/import.
import * as XLSX from 'xlsx';

import { TEMPLATES } from './templates';
import { STYLE_GROUPS } from './styles';

const SHOW_ADS = true; // Toggle this to true when you want to show ads

const HISTORY_ENTRIES = [
  {
    date: '2026-04-01',
    version: '1.0',
    title: 'Initial production deployment',
    description: 'Initial deployment at https://mappingaiprompt.vercel.app. Core features included modular prompt mapping, DnD builder, saving to local gallery, and export to PNG/XLSX.'
  },
  {
    date: '2026-04-03',
    version: '1.1',
    title: 'Gallery Excel sync improvements',
    description: 'Added gallery-wide Excel import/export, table header format, clear-import behavior, gallery search X button, and hidden desktop scrollbar for blueprint.'
  }
];

const getIcon = (type) => {
  switch (type) {
    case 'character': return <UserPlus size={16} className="text-orange-500" />;
    case 'interaction': return <Target size={16} className="text-red-500" />;
    case 'negative': return <Ban size={16} className="text-slate-400" />;
    case 'motion': return <Film size={16} className="text-purple-500" />;
    case 'camera': return <Camera size={16} className="text-indigo-500" />;
    case 'sequence': return <Clock size={16} className="text-emerald-500" />;
    case 'style': return <Palette size={16} className="text-pink-500" />;
    case 'magic': return <Zap size={16} className="text-emerald-400" />;
    default: return <Layers size={16} className="text-blue-400" />;
  }
};

function SortableEntity({
  entity,
  toggleEntity,
  removeEntity,
  updateEntityName,
  toggleItem,
  addItem,
  removeItem
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };


  const getHeaderBg = () => {
    switch (entity.type) {
      case 'character': return 'bg-orange-600';
      case 'interaction': return 'bg-red-600';
      case 'environment': return 'bg-blue-600';
      case 'motion': return 'bg-purple-600';
      case 'camera': return 'bg-indigo-600';
      case 'sequence': return 'bg-emerald-600';
      case 'style': return 'bg-pink-600';
      case 'magic': return 'bg-emerald-500';
      case 'negative': return 'bg-slate-700';
      default: return 'bg-slate-900';
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-2">
      <div className={`${getHeaderBg()} py-2 px-3 flex items-center justify-between cursor-pointer`} onClick={() => toggleEntity(entity.id)}>
        <div className="flex items-center gap-3 flex-1">
          <div {...attributes} {...listeners} className="text-slate-500 hover:text-white cursor-grab active:cursor-grabbing">
            <GripVertical size={16} />
          </div>
          <div className="flex items-center gap-2 group/title">
            {getIcon(entity.type)}
            <input
              className="bg-transparent text-white font-black uppercase tracking-widest text-[10px] border-none focus:ring-0 w-64 p-0 outline-none"
              value={entity.name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateEntityName(entity.id, e.target.value)}
            />
            <Pencil size={10} className="text-white/30 opacity-0 group-hover/title:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {entity.isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
          <button onClick={(e) => { e.stopPropagation(); removeEntity(entity.id); }} className="text-slate-500 hover:text-red-400">
            <X size={16} />
          </button>
        </div>
      </div>

      {entity.isOpen && (
        <div className="p-2 space-y-1 bg-white">
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {entity.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-4 py-1.5 border-b border-slate-50 last:border-0 hover:bg-orange-50/30 transition-colors cursor-pointer group`}
                onClick={() => toggleItem(entity.id, item.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.selected ? <CheckCircle2 size={14} className={`${entity.type === 'negative' ? 'text-slate-500' : 'text-orange-600'}`} /> : <Circle size={14} className="text-slate-300" />}
                  <span className={`text-sm ${item.selected ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>{item.text}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(entity.id, item.id); }}
                  className="text-slate-300 hover:text-red-500 p-1 transition-colors group-hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-slate-100 bg-slate-50/50">
            <div className="relative">
              <input
                type="text"
                placeholder={`Add detail to ${entity.name}...`}
                className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all shadow-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    addItem(entity.id, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <div className="absolute right-3 top-1.5 text-[8px] text-slate-400 font-bold uppercase pointer-events-none">
                Press Enter
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const LANGUAGES = [
  { code: 'id', label: 'Languages' },
  { code: 'af', label: '🇿🇦 Afrikaans' },
  { code: 'ar', label: '🇸🇦 Arabic' },
  { code: 'az', label: '🇦🇿 Azerbaijani' },
  { code: 'bg', label: '🇧🇬 Bulgarian' },
  { code: 'bn', label: '🇧🇩 Bengali' },
  { code: 'cs', label: '🇨🇿 Czech' },
  { code: 'da', label: '🇩🇰 Danish' },
  { code: 'de', label: '🇩🇪 German' },
  { code: 'el', label: '🇬🇷 Greek' },
  { code: 'es', label: '🇪🇸 Spanish' },
  { code: 'fa', label: '🇮🇷 Persian' },
  { code: 'fi', label: '🇫🇮 Finnish' },
  { code: 'fr', label: '🇫🇷 French' },
  { code: 'he', label: '🇮🇱 Hebrew' },
  { code: 'hi', label: '🇮🇳 Hindi' },
  { code: 'hr', label: '🇭🇷 Croatian' },
  { code: 'hu', label: '🇭🇺 Hungarian' },
  { code: 'it', label: '🇮🇹 Italian' },
  { code: 'ja', label: '🇯🇵 Japanese' },
  { code: 'ko', label: '🇰🇷 Korean' },
  { code: 'lt', label: '🇱🇹 Lithuanian' },
  { code: 'ms', label: '🇲🇾 Malay' },
  { code: 'nl', label: '🇳🇱 Dutch' },
  { code: 'no', label: '🇳🇴 Norwegian' },
  { code: 'pl', label: '🇵🇱 Polish' },
  { code: 'pt', label: '🇵🇹 Portuguese' },
  { code: 'ro', label: '🇷🇴 Romanian' },
  { code: 'ru', label: '🇷🇺 Russian' },
  { code: 'sk', label: '🇸🇰 Slovak' },
  { code: 'sq', label: '🇦🇱 Albanian' },
  { code: 'sr', label: '🇷🇸 Serbian' },
  { code: 'sv', label: '🇸🇪 Swedish' },
  { code: 'sw', label: '🇰🇪 Swahili' },
  { code: 'ta', label: '🇮🇳 Tamil' },
  { code: 'th', label: '🇹🇭 Thai' },
  { code: 'tl', label: '🇵🇭 Filipino' },
  { code: 'tr', label: '🇹🇷 Turkish' },
  { code: 'uk', label: '🇺🇦 Ukrainian' },
  { code: 'ur', label: '🇵🇰 Urdu' },
  { code: 'uz', label: '🇺🇿 Uzbek' },
  { code: 'vi', label: '🇻🇳 Vietnamese' },
  { code: 'zh', label: '🇨🇳 Chinese' },
];

export default function App() {
  const [entities, setEntities] = useState(TEMPLATES[0].data);
  const [isCopied, setIsCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedPrompt, setTranslatedPrompt] = useState('');
  const [error, setError] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('id');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const fileInputRef = useRef(null);
  const storageImportRef = useRef(null);
  const galleryExcelInputRef = useRef(null);

  useEffect(() => {
    document.title = 'Mapping AI Prompt v1.1';
  }, []);

  // Storage States
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState(() => {
    try {
      const saved = localStorage.getItem('mapping_ai_prompts');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [folders, setFolders] = useState(() => {
    try {
      const saved = localStorage.getItem('mapping_ai_folders');
      return saved ? JSON.parse(saved) : ['Uncategorized'];
    } catch { return ['Uncategorized']; }
  });
  const [gallerySortBy, setGallerySortBy] = useState('Newest');
  const [activeFolder, setActiveFolder] = useState('All');
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('mapping_ai_prompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  useEffect(() => {
    localStorage.setItem('mapping_ai_folders', JSON.stringify(folders));
  }, [folders]);

  // Storage Logic
  const handleSaveToStorage = () => {
    if (!recipeTitle || recipeTitle.trim() === '') {
      alert("Title is required! Please enter a title in the Main Page before saving.");
      return;
    }
    const newPrompt = {
      id: `prompt-${Date.now()}`,
      title: recipeTitle.trim(),
      promptText: finalPrompt,
      entities: JSON.parse(JSON.stringify(entities)),
      timestamp: Date.now(),
      isFavorite: false,
      folder: 'Uncategorized'
    };
    setSavedPrompts([newPrompt, ...savedPrompts]);
    alert("Saved to Browser Storage!");
  };

  const toggleStar = (id) => {
    setSavedPrompts(prompts => prompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };
  
  const deleteSaved = (id) => {
    if(confirm('Delete this saved prompt?')) {
      setSavedPrompts(prompts => prompts.filter(p => p.id !== id));
    }
  };

  const updateSavedFolder = (id, folderName) => {
    setSavedPrompts(prompts => prompts.map(p => p.id === id ? { ...p, folder: folderName } : p));
  };

  const loadSaved = (promptData) => {
    setEntities(promptData.entities);
    setRecipeTitle(promptData.title);
    setTranslatedPrompt('');
    setIsGalleryOpen(false);
  };

  const createNewFolder = () => {
    if (newFolderName.trim() && !folders.includes(newFolderName.trim())) {
      setFolders([...folders, newFolderName.trim()]);
      setNewFolderName('');
    }
  };

  const exportStorageJSON = () => {
    const data = { prompts: savedPrompts, folders: folders };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MappingAI_Backup_${Date.now()}.json`;
    link.click();
  };

  const importStorageJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.prompts && imported.folders) {
          setSavedPrompts(imported.prompts);
          setFolders(imported.folders);
        } else {
             alert('Invalid backup file format.');
        }
      } catch (err) { alert('Failed to parse JSON file.'); }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const clearStorage = () => {
    if(confirm('Are you sure you want to clear ALL saved prompts and folders? This cannot be undone.')) {
      setSavedPrompts([]);
      setFolders(['Uncategorized']);
    }
  };

  const filteredAndSortedPrompts = useMemo(() => {
    let result = [...savedPrompts];
    if (activeFolder !== 'All') {
      result = result.filter(p => p.folder === activeFolder);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.promptText && p.promptText.toLowerCase().includes(q))
      );
    }
    if (gallerySortBy === 'Newest') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (gallerySortBy === 'Oldest') {
      result.sort((a, b) => a.timestamp - b.timestamp);
    } else if (gallerySortBy === 'Best') {
      result = result.filter(p => p.isFavorite);
      result.sort((a, b) => b.timestamp - a.timestamp);
    }
    return result;
  }, [savedPrompts, gallerySortBy, activeFolder, searchQuery]);

  const PHOTO_MAGIC = [
    "8k resolution", "extremely detailed", "photorealistic", "cinematic lighting", "ray tracing", "sharp focus", "masterpiece", "octane render", "stunning composition", "vivid colors", "highly intricate details",
    "unreal engine 5", "volumetric fog", "subsurface scattering", "intricate textures", "hyper-realistic", "4k texture", "dramatic highlights", "moody lighting", "depth of field", "bokeh", "clean edges"
  ];
  const VIDEO_MAGIC = [
    "high framerate", "fluid motion", "professional color grading", "smooth transitions", "RAW video", "motion blur", "natural physics", "flawless camera movement", "cinematic motion", "high dynamic range",
    "120fps", "steadycam shot", "dynamic parallax", "slow motion", "time-lapse essence", "particle simulation", "realistic liquid physics", "global illumination", "film noir vibe", "vibrant contrast"
  ];

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const rawGeneratedPrompt = useMemo(() => {
    const sanitizeLabel = (text) => text.trim().replace(/(Character|SUBJECT|Subject)\s+(\d+)/gi, '$1_$2');
    const characters = entities.filter(e => e.type === 'character');
    const interactions = entities.filter(e => e.type === 'interaction');
    const environments = entities.filter(e => e.type === 'environment');
    const motions = entities.filter(e => e.type === 'motion');
    const cameras = entities.filter(e => e.type === 'camera');
    const sequences = entities.filter(e => e.type === 'sequence');
    const styles = entities.filter(e => e.type === 'style');
    const magics = entities.filter(e => e.type === 'magic');
    const negatives = entities.filter(e => e.type === 'negative');

    const isVideo = motions.length > 0 || cameras.length > 0 || sequences.length > 0;
    let promptParts = [];

    const magicItems = magics.flatMap(e => e.items.filter(i => i.selected).map(i => i.text));
    if (magicItems.length > 0) {
      promptParts.push(`QUALITY ENHANCERS: ${magicItems.join(', ')}`);
    }

    const styleItems = styles.flatMap(e => e.items.filter(i => i.selected).map(i => i.text));
    if (styleItems.length > 0) {
      promptParts.push(`VISUAL STYLES: ${styleItems.join(', ')}`);
    }

    const sequenceItems = sequences.flatMap(e => e.items.filter(i => i.selected).map(i => i.text));
    if (sequenceItems.length > 0) {
      promptParts.push(`VIDEO STORYBOARD SEQUENCES:\n${sequenceItems.join('\n')}\n`);
    }

    const interactionItems = interactions.flatMap(e => e.items.filter(i => i.selected).map(i => sanitizeLabel(i.text)));
    if (interactionItems.length > 0) {
      promptParts.push(`A ${isVideo ? 'cinematic video' : 'cinematic scene'} where ${interactionItems.join('. ')}`);
    } else if (characters.length > 1) {
      promptParts.push(`A ${isVideo ? 'high-quality video' : 'cinematic photo'} featuring ${characters.length} characters`);
    } else {
      promptParts.push(`A ${isVideo ? 'detailed professional video' : 'high-quality professional portrait'}`);
    }

    characters.forEach(char => {
      const details = char.items.filter(i => i.selected).map(i => i.text).join(', ');
      if (details) promptParts.push(`${sanitizeLabel(char.name)} is ${details}.`);
    });

    const envItems = environments.flatMap(e => e.items.filter(i => i.selected).map(i => i.text));
    if (envItems.length > 0) {
      promptParts.push(`The setting is a ${envItems.join('. ')}`);
    }

    const motionItems = motions.flatMap(e => e.items.filter(i => i.selected).map(i => i.text));
    if (motionItems.length > 0) {
      promptParts.push(`The action involves ${motionItems.join('. ')}`);
    }

    const cameraItems = cameras.flatMap(e => e.items.filter(i => i.selected).map(i => i.text));
    if (cameraItems.length > 0) {
      promptParts.push(`Camera movement: ${cameraItems.join('. ')}`);
    }

    let finalOutput = promptParts.join('. ').replace(/\s+/g, ' ').replace(/\.\./g, '.').replace(/\. \./g, '.').trim();
    if (finalOutput && !finalOutput.endsWith('.')) finalOutput += '.';

    const negativeItems = negatives.flatMap(e => e.items.filter(i => i.selected).map(i => i.text));
    if (negativeItems.length > 0) {
      finalOutput += `\n\nNegative Prompt: ${negativeItems.join(', ')}`;
    }
    return finalOutput;
  }, [entities]);

  const finalPrompt = translatedPrompt || rawGeneratedPrompt;

  const recipeId = useMemo(() => {
    if (!finalPrompt) return 'MP-XXXXXX';
    const hash = finalPrompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `MP-${hash.toString(36).toUpperCase()}-${Math.random().toString(36).substring(7, 10).toUpperCase()}`;
  }, [finalPrompt]);

  const translatePrompt = async () => {
    if (!rawGeneratedPrompt || isTranslating) return;
    setIsTranslating(true);
    setError(null);

    // Revert to MyMemory API since Google Cloud is blocking Free Tier access
    const translateText = async (text) => {
      if (!text.trim()) return text;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${sourceLanguage}|en`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.responseStatus === 200 && data.responseData.translatedText) {
          return data.responseData.translatedText;
        }
      } catch (_) {}
      return text;
    };

    try {
      // Split at ". " to keep each chunk short for MyMemory API limits, translate individually, then rejoin
      const sentences = rawGeneratedPrompt.split(/(?<=\. )/);
      const translatedSentences = await Promise.all(sentences.map(s => translateText(s)));
      setTranslatedPrompt(translatedSentences.join('').trim());
    } catch (err) {
      setError(`Translation failed: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const downloadRecipeCard = async () => {
    const element = document.getElementById('recipe-card-content');
    if (!element) return;
    
    try {
      const dataUrl = await domToDataUrl(element, {
        scale: 2,
        quality: 1,
        backgroundColor: '#FAF9F6' // Match card background
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `MappingPrompt_Recipe_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
      setError("Failed to generate image. Please try taking a screenshot manually.");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setEntities((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const loadRandomTemplate = (typeFilter) => {
    const filtered = typeFilter ? TEMPLATES.filter(t => t.type === typeFilter) : TEMPLATES;
    const randomIdx = Math.floor(Math.random() * filtered.length);
    const selectedTemplate = filtered[randomIdx];
    const newTemplate = JSON.parse(JSON.stringify(selectedTemplate.data));
    const freshened = newTemplate.map(ent => ({
      ...ent,
      id: `entity-${Date.now()}-${Math.random()}`,
      items: ent.items.map(it => ({ ...it, id: `item-${Date.now()}-${Math.random()}` }))
    }));
    setEntities(freshened);
    setRecipeTitle(selectedTemplate.name);
    setTranslatedPrompt('');
  };

  const addEntity = (type) => {
    setTranslatedPrompt('');
    const newId = `entity-${Date.now()}`;
    const nameMap = { 
      character: 'New Character', 
      interaction: 'New Interaction', 
      environment: 'New Environment', 
      motion: 'New Motion',
      camera: 'Camera Move',
      sequence: 'Time Sequence',
      style: 'Visual Styles',
      negative: 'Negative' 
    };
    setEntities(prev => [...prev, { id: newId, name: nameMap[type], type, isOpen: true, items: [] }]);
  };

  const handleSelectStyle = (text, tokens) => {
    setTranslatedPrompt('');
    const tokensToToggle = tokens || [text];
    
    setEntities(prev => {
      const styleEntity = prev.find(e => e.type === 'style');
      
      // Check if ALL tokens are already active
      const allActive = styleEntity && tokensToToggle.every(token => 
        styleEntity.items.some(i => i.text === token && i.selected)
      );

      if (allActive) {
        // REMOVE logic: Filter out these tokens
        if (!styleEntity) return prev;
        const newItems = styleEntity.items.filter(i => !tokensToToggle.includes(i.text));
        
        // If no items left, we could optionally remove the entity, but better to keep it empty for UI stability
        return prev.map(e => e.type === 'style' ? { ...e, items: newItems } : e);
      } else {
        // ADD/ACTIVATE logic (as before)
        if (styleEntity) {
          let updatedItems = [...styleEntity.items];
          tokensToToggle.forEach(token => {
            const itemExists = updatedItems.find(i => i.text === token);
            if (!itemExists) {
              updatedItems.push({ id: `item-${Date.now()}-${Math.random()}`, text: token, selected: true });
            } else {
              updatedItems = updatedItems.map(i => i.text === token ? { ...i, selected: true } : i);
            }
          });
          return prev.map(e => e.type === 'style' ? { ...e, items: updatedItems } : e);
        } else {
          const newItems = tokensToToggle.map(token => ({ id: `item-${Date.now()}-${Math.random()}`, text: token, selected: true }));
          return [...prev, { id: `entity-${Date.now()}`, name: 'Visual Styles', type: 'style', isOpen: true, items: newItems }];
        }
      }
    });
  };

  const handleMagicEnhance = () => {
    setTranslatedPrompt('');
    const isVideoBody = entities.some(e => e.type === 'motion' || e.type === 'camera' || e.type === 'sequence');
    const pool = isVideoBody ? VIDEO_MAGIC : PHOTO_MAGIC;
    
    // Pick 3-4 random items from the pool that ARE NOT already in the magic entity
    setEntities(prev => {
      const magicEntity = prev.find(e => e.type === 'magic');
      const existingTexts = magicEntity ? magicEntity.items.map(i => i.text) : [];
      
      const availableItems = pool.filter(text => !existingTexts.includes(text));
      const selected = [...availableItems].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      if (selected.length === 0) return prev; // No new items to add

      const newItems = selected.map(text => ({ id: `item-${Date.now()}-${Math.random()}`, text, selected: true }));
      
      if (magicEntity) {
        return prev.map(e => e.type === 'magic' ? { ...e, items: [...e.items, ...newItems] } : e);
      } else {
        return [...prev, { id: `entity-${Date.now()}`, name: 'Magic Enhancer', type: 'magic', isOpen: true, items: newItems }];
      }
    });
  };

  const updateEntityName = (id, name) => { setTranslatedPrompt(''); setEntities(entities.map(e => e.id === id ? { ...e, name } : e)); };
  const toggleEntity = (id) => setEntities(entities.map(e => e.id === id ? { ...e, isOpen: !e.isOpen } : e));
  const removeEntity = (id) => { setTranslatedPrompt(''); setEntities(entities.filter(e => e.id !== id)); };
  const toggleItem = (entId, itemId) => { setTranslatedPrompt(''); setEntities(entities.map(e => e.id === entId ? { ...e, items: e.items.map(i => i.id === itemId ? { ...i, selected: !i.selected } : i) } : e)); };
  const addItem = (entId, text) => { setTranslatedPrompt(''); setEntities(entities.map(e => e.id === entId ? { ...e, items: [...e.items, { id: `item-${Date.now()}`, text, selected: true }] } : e)); };
  const removeItem = (entId, itemId) => { setTranslatedPrompt(''); setEntities(entities.map(e => e.id === entId ? { ...e, items: e.items.filter(i => i.id !== itemId) } : e)); };

  const exportGalleryToExcel = () => {
    if (savedPrompts.length === 0) {
      alert('No prompts available in gallery for export.');
      return;
    }

    const workbook = XLSX.utils.book_new();

    savedPrompts.forEach((prompt) => {
      const rows = [];
      rows.push(['Title', prompt.title]);
      rows.push(['Folder', prompt.folder]);
      rows.push(['IsFavorite', prompt.isFavorite ? 'true' : 'false']);
      rows.push(['Section', 'Type', 'Detail', 'IsSelected']);

      // Data rows: Section | Type | Detail | IsSelected
      prompt.entities.forEach((entity) => {
        const sectionName = entity.name || '';
        const typeName = entity.type || '';
        (entity.items || []).forEach((item) => {
          rows.push([sectionName, typeName, item.text || '', item.selected ? 'true' : 'false']);
        });
      });

      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const sheetName = prompt.title ? prompt.title.substring(0, 31) : `Prompt-${Date.now()}`;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, `gallery_prompts_${Date.now()}.xlsx`);
  };

  const importGalleryFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.prompts && imported.folders) {
            setSavedPrompts(imported.prompts);
            setFolders(imported.folders);
            setError(null);
          } else {
            alert('JSON tidak valid untuk gallery import.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const importedPrompts = [];

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: '' });

          if (!rows || rows.length < 4) return;

          const title = rows[0][1] || `Sheet-${Math.floor(Math.random()*10000)}`;
          const folder = rows[1][1] || 'Uncategorized';
          const isFavoriteRaw = String(rows[2][1] || 'false').toLowerCase();
          const isFavorite = isFavoriteRaw === 'true' || isFavoriteRaw === '1' || isFavoriteRaw === 'yes';

          let entityRows = rows.slice(4);
          if (rows[3] && String(rows[3][0]).toLowerCase() === 'section' && String(rows[3][1]).toLowerCase() === 'type') {
            // header row already skipped
          } else {
            entityRows = rows.slice(3);
          }

          const sectionMap = new Map();
          entityRows.forEach((row) => {
            const sectionName = row[0] ? String(row[0]) : '';
            const typeName = row[1] ? String(row[1]) : '';
            const detailText = row[2] ? String(row[2]) : '';
            const selectedValue = row[3] ? String(row[3]).toLowerCase() : 'false';
            const selected = selectedValue === 'true' || selectedValue === '1' || selectedValue === 'yes';

            if (!sectionName || !detailText) return;

            if (!sectionMap.has(sectionName)) {
              sectionMap.set(sectionName, {
                id: `entity-${Date.now()}-${Math.random()}`,
                name: sectionName,
                type: typeName || 'character',
                isOpen: true,
                items: []
              });
            }

            sectionMap.get(sectionName).items.push({
              id: `item-${Date.now()}-${Math.random()}`,
              text: detailText,
              selected
            });
          });

          importedPrompts.push({
            id: `prompt-${Date.now()}-${Math.random()}`,
            title: sheetName,
            folder,
            isFavorite,
            timestamp: Date.now(),
            promptText: '',
            entities: Array.from(sectionMap.values())
          });
        });

        if (importedPrompts.length > 0) {
          setSavedPrompts([]);
          setFolders(['Uncategorized']);
          setSavedPrompts(importedPrompts);
          setFolders([...new Set(importedPrompts.map(p => p.folder || 'Uncategorized'))]);
          setError(null);
          alert(`${importedPrompts.length} prompt berhasil diimport dari Excel.`);
        } else {
          alert('Tidak ada data prompt valid yang ditemukan di file Excel.');
        }
      } catch (err) {
        setError('Failed to parse gallery Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 bg-[#FDFCFB] text-slate-900 p-4 md:p-6 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          <header className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-black flex items-center gap-2">
                <div className="p-1.5 bg-[#1d4f7a] rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 1080 1080" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M999.051,570.308q-51.3,49.789-144.666,49.775c-67.995,0-108.838-.022-111.384-0.023V790.739q0,7.2-.586,13.588-0.8,17.511-7.669,29.436a43.271,43.271,0,0,1-6.536,9.417q-14.8,16-49.916,16c-0.079,0-.153,0-0.232,0s-0.155,0-.235,0q-3.987,0-7.764-.245-27.245-1.648-41.787-14.581c-0.12-.1-0.247-0.186-0.366-0.284q-18.5-15.1-18.488-44.442V619.945H548.566q-44.394,0-44.389-51.984,0-25.255,11.263-40.1,11.257-14.863,33.126-14.852h60.856V420.1q0-3.321.064-6.586-5.136-76.059-78.17-76.075-39.756,0-59.161,25.332t-19.412,80.439V781.851q0,36.456-14.79,52.441t-49.917,16q-35.141,0-51.766-16.444t-16.638-52V443.205q0-105.763-78.573-105.771t-78.573,87.994v374.2q0,59.559-64.707,59.552-31.437,0-49.917-15.11-18.5-15.1-18.488-44.442V432.539q0-104.868,46.682-158.657,46.667-53.767,138.2-53.774,67.467,0,111.851,26.665t59.161,76.44q14.776-49.769,59.161-76.44t113.7-26.665q78.981,0,123.575,36.492,55.789-36.474,165.292-36.492,95.2,0,149.288,48.886t54.072,157.323Q1050.35,520.541,999.051,570.308ZM922.327,357.433q-11.569-21.769-32.353-28.443-20.8-6.666-50.38-6.666-53.621,0-75.337,18.665t-21.723,64.885c0,1.535,0,3.32,0,5.31q0.463,10.393.472,21.355v79.8c4.161,0.041,24.156.2,85.5,0.2q39.734,0,62.858-6.666,23.1-6.666,32.816-25.332t9.706-54.219Q933.882,379.216,922.327,357.433Z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span>Mapping AI Prompt</span>
                  <span className="text-xs text-slate-500 font-medium">v1.1</span>
                </div>
              </h1>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap pb-3 border-b border-slate-50">
                <button onClick={() => loadRandomTemplate('image')} className="px-4 py-2 bg-purple-600 text-white border border-purple-500 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-purple-700 transition-all shadow-md active:scale-95"><ImageIcon size={14} /> Random Image</button>
                <button onClick={() => loadRandomTemplate('video')} className="px-4 py-2 bg-indigo-600 text-white border border-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md active:scale-95"><Video size={14} /> Random Video</button>
                <button onClick={() => setShowHistoryModal(true)} className="px-4 py-2 bg-slate-900 text-white border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md active:scale-95"><Clock size={14} /> History</button>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {[
                  { type: 'character', label: '+ Char', color: 'bg-orange-600', tooltip: 'Add subject details (e.g. Robot, Girl)' },
                  { type: 'interaction', label: '+ Interact', color: 'bg-red-600', tooltip: 'Add actions between subjects' },
                  { type: 'environment', label: '+ Env', color: 'bg-blue-600', tooltip: 'Add location/weather details' },
                  { type: 'motion', label: '+ Motion', color: 'bg-purple-500', tooltip: 'Add movement for video (e.g. Panning)' },
                  { type: 'camera', label: '+ Cam', color: 'bg-indigo-500', tooltip: 'Add camera angle/lens details' },
                  { type: 'sequence', label: '+ Seq', color: 'bg-emerald-600', tooltip: 'Add timestamped story sequence' },
                  { type: 'style', label: '+ Style', color: 'bg-pink-500', tooltip: 'Add artistic style or theme' },
                  { type: 'negative', label: '+ Neg', color: 'bg-slate-500', tooltip: 'Exclude things from the result' },
                ].map((btn) => (
                  <div key={btn.type} className="relative group/tooltip">
                    <button 
                      onClick={() => addEntity(btn.type)} 
                      className={`px-2.5 py-1.5 ${btn.color} text-white rounded-lg text-[10px] font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-sm whitespace-nowrap`}
                    >
                      {btn.label}
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-36 p-1.5 bg-slate-900 text-white text-[9px] font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-[100] shadow-xl border border-white/10 text-center leading-tight">
                      {btn.tooltip}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-6 border-transparent border-b-slate-900"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex block">Prompt Title <span className="text-red-500 ml-1">*</span></label>
               <input 
                 type="text" 
                 value={recipeTitle}
                 onChange={(e) => setRecipeTitle(e.target.value)}
                 placeholder="Input Prompt Title"
                 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
               />
            </div>
          </header>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={entities.map(e => e.id)} strategy={verticalListSortingStrategy}>
              {entities.map((entity) => (
                <SortableEntity
                  key={entity.id} entity={entity} toggleEntity={toggleEntity} removeEntity={removeEntity}
                  updateEntityName={updateEntityName} toggleItem={toggleItem} addItem={addItem} removeItem={removeItem}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
             onClick={handleSaveToStorage}
             className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 border border-indigo-500 mb-2"
          >
             <Save size={20} /> Save to Browser Storage 
          </button>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Palette size={18} className="text-pink-500" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Style Gallery</h3>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-full ml-auto">Quick Presets</span>
            </div>
            {STYLE_GROUPS.map((group) => (
              <div key={group.name} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{group.name}</h4>
                   {group.isMaster && <span className="text-[9px] px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-md font-black uppercase">Master</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isSelected = item.tokens 
                       ? item.tokens.every(token => entities.some(e => e.type === 'style' && e.items.some(i => i.text === token && i.selected)))
                       : entities.some(e => e.type === 'style' && e.items.some(i => i.text === item.text && i.selected));
                    
                    const themeColor = group.isMaster ? 'indigo' : 'pink';

                    return (
                      <div key={item.id} className="relative group/tooltip">
                        <button
                          onClick={() => handleSelectStyle(item.text, item.tokens)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            isSelected 
                              ? `bg-${themeColor}-50 border-${themeColor}-200 text-${themeColor}-700 shadow-sm` 
                              : `bg-white border-slate-100 text-slate-600 hover:border-${themeColor}-200 hover:bg-${themeColor}-50/50`
                          }`}
                        >
                          <span className="text-sm">{item.icon}</span>
                          {item.text}
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-xl border border-white/10 text-center leading-relaxed">
                          {item.description}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {/* Desktop Ad Space (300x250) - Only visible if SHOW_ADS is true */}
          {SHOW_ADS && (
            <div className="hidden md:flex mb-4 w-full justify-center">
              <div className="w-[300px] h-[250px] bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 group hover:border-slate-300 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest mb-1 italic">Advertisement</span>
                <span className="text-[10px] font-bold">300 x 250</span>
              </div>
            </div>
          )}

          <div className="bg-[#121417] rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] bg-orange-600/20 -mr-20 -mt-20"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mapped Output</h2>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <select
                  value={sourceLanguage}
                  onChange={(e) => { setSourceLanguage(e.target.value); setTranslatedPrompt(''); }}
                  className="bg-white/10 text-white text-[10px] rounded-lg px-2 py-1.5 border border-white/20 outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                  style={{ maxWidth: '120px' }}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="bg-white text-slate-900">
                      {lang.label}
                    </option>
                  ))}
                </select>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative group/tooltip">
                  <button
                    onClick={translatePrompt}
                    disabled={isTranslating || !rawGeneratedPrompt || (translatedPrompt && translatedPrompt === rawGeneratedPrompt)}
                    className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5"
                  >
                    {isTranslating ? <Loader2 size={14} className="animate-spin" /> : <Languages size={14} />}
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 p-1.5 bg-slate-900 text-white text-[9px] font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-[100] shadow-xl border border-white/10 text-center leading-tight">
                    Translate to English
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-6 border-transparent border-b-slate-900"></div>
                  </div>
                </div>

                <div className="relative group/tooltip">
                  <button
                    onClick={handleMagicEnhance}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg active:scale-95 border border-emerald-400/30 flex items-center justify-center"
                  >
                    <Zap size={14} className="text-white animate-pulse" />
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-36 p-1.5 bg-slate-900 text-white text-[9px] font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-[100] shadow-xl border border-white/10 text-center leading-tight">
                    Magic Enhance: Add Pro Keywords
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-6 border-transparent border-b-slate-900"></div>
                  </div>
                </div>

                <div className="relative group/tooltip">
                  <button
                    onClick={() => setShowRecipeModal(true)}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg active:scale-95 border border-indigo-400/30 flex items-center justify-center"
                  >
                    <FileImage size={14} className="text-white" />
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-36 p-1.5 bg-slate-900 text-white text-[9px] font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-[100] shadow-xl border border-white/10 text-center leading-tight">
                    View & Download Recipe Card
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-6 border-transparent border-b-slate-900"></div>
                  </div>
                </div>

                <div className="relative group/tooltip">
                  <button
                    onClick={() => {
                        const shareUrl = "https://mappingaiprompt.vercel.app/";
                        const shareText = "Check out this amazing AI Prompt Mapping tool! 🎨✨";
                        const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
                        window.open(redditUrl, '_blank');
                    }}
                    className="p-1.5 rounded-lg bg-orange-700/50 hover:bg-orange-600 transition-all shadow-lg active:scale-95 border border-white/10 flex items-center justify-center"
                  >
                    <Share2 size={14} className="text-white" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-[200] pointer-events-auto">
                    <p className="text-[9px] font-black uppercase text-slate-500 mb-2 px-2">Share App</p>
                    <div className="grid grid-cols-1 gap-1">
                        <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("I'm using Mapping AI Prompt to build professional AI prompts! 🎨✨")}&url=${encodeURIComponent("https://mappingaiprompt.vercel.app/")}`, '_blank')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white transition-colors">
                            <span className="w-5 h-5 flex items-center justify-center bg-black/50 rounded-md">𝕏</span> Twitter / X
                        </button>
                        <button onClick={() => window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent("I'm using Mapping AI Prompt to build professional AI prompts! 🎨✨ https://mappingaiprompt.vercel.app/")}`, '_blank')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white transition-colors">
                            <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-md text-white font-serif">@</span> Threads
                        </button>
                        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Check out this Mapping AI Prompt tool! 🎨✨ https://mappingaiprompt.vercel.app/")}`, '_blank')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white transition-colors">
                            <span className="w-5 h-5 flex items-center justify-center bg-green-600/50 rounded-md">W</span> WhatsApp
                        </button>
                        <button onClick={() => window.open(`https://www.reddit.com/submit?url=${encodeURIComponent("https://mappingaiprompt.vercel.app/")}&title=${encodeURIComponent("Visual Blueprint & Mapping tool for AI Prompts")}`, '_blank')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white transition-colors">
                            <span className="w-5 h-5 flex items-center justify-center bg-orange-600/50 rounded-md">R</span> Reddit
                        </button>
                        <hr className="border-white/5 my-1" />
                        <button onClick={() => { navigator.clipboard.writeText("https://mappingaiprompt.vercel.app/"); alert("Link Copied!"); }} className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white transition-colors">
                            <Link size={12} /> Copy App URL
                        </button>
                    </div>
                  </div>
                </div>

                <div className="relative group/tooltip">
                  <button
                    onClick={() => { navigator.clipboard.writeText(finalPrompt); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-md active:scale-95 ${isCopied ? 'bg-green-500 text-white' : 'bg-orange-600 text-white'}`}
                  >
                    {isCopied ? 'Copied!' : 'Copy Prompt'}
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 p-1.5 bg-slate-900 text-white text-[9px] font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-[100] shadow-xl border border-white/10 text-center leading-tight">
                    Copy to Clipboard
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-6 border-transparent border-b-slate-900"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-[250px] bg-white/5 rounded-xl p-5 border border-white/10 italic font-serif leading-relaxed text-base relative">
              {error && <div className="text-red-400 text-[10px] mb-2">{error}</div>}
              {finalPrompt || "Add a character to get started..."}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</p>
                  <p className="text-sm font-bold text-slate-900">Prompt Management</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600">Ads fund AI</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { navigator.clipboard.writeText(finalPrompt); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-wider text-xs transition-all hover:bg-indigo-500 active:scale-95 shadow-sm"
                >
                  {isCopied ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    </main>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Release History</h3>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"><X size={16} /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5 space-y-4 text-sm text-slate-700">
              {HISTORY_ENTRIES.map((entry) => (
                <div key={`${entry.date}-${entry.version}`} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{entry.date}</p>
                      <h4 className="text-base font-black text-slate-900">{entry.title}</h4>
                    </div>
                    <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg">{entry.version}</span>
                  </div>
                  <p className="mt-2 text-slate-600">{entry.description}</p>
                </div>
              ))}
              <p className="text-xs text-slate-400">Source: .guide_book/history.md</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section - Full Width Background */}
      <footer className="bg-[#0A0B0D] text-white py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Column 1: Feedback */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Feedback</h4>
            <ul className="space-y-4">
              <li><a href="mailto:promptferry@gmail.com" className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors">Send Feedback</a></li>
            </ul>
          </div>

          {/* Columns 2-5: Empty space */}
          <div className="hidden md:block"></div>
          <div className="hidden md:block"></div>
          <div className="hidden md:block"></div>
          <div className="hidden md:block"></div>

          {/* Column 6: Support */}
          <div className="space-y-6 text-right flex flex-col items-end">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Support</h4>
            <div className="space-y-4">
              <ul className="space-y-4">
                <li><a href="https://ko-fi.com/promptferry" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors">Buy me coffee</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white rounded-lg flex items-center justify-center">
              <Sparkles size={12} className="text-black" />
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">Mapping AI Prompt</span>
              <span className="text-[9px] font-bold text-slate-600">&copy; 2026. All rights reserved.</span>
              <span className="text-[9px] text-slate-400 mt-1">v1.1</span>
            </div>
          </div>
        </div>
      </footer>


      {/* Browser Storage Sticky Controls */}
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 md:px-6 pointer-events-none">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-3 md:flex-row md:justify-center md:items-end md:gap-4">
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-slate-900/95 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-indigo-500/10 border border-white/10 transition-all hover:bg-slate-800 hover:scale-105 active:scale-95"
          >
            <Database size={16} className="text-indigo-400" /> Storage Gallery
            <span className="bg-white/10 px-2.5 py-1 rounded-full text-[10px] text-indigo-300">{savedPrompts.length}</span>
          </button>

          {SHOW_ADS && (
            <div className="pointer-events-auto w-[320px] rounded-3xl bg-slate-900/95 border border-white/10 px-4 py-3 shadow-2xl text-white text-xs uppercase tracking-[0.2em] font-black md:w-[728px] md:h-[90px] md:px-6 md:py-4">
              <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-200 md:flex-row md:justify-between md:gap-0">
                <div className="text-center md:text-left">
                  <div className="text-[11px]">Sponsored AI Engine</div>
                  <div className="text-lg font-black">728 x 90 / 320 x 100</div>
                </div>
                <div className="text-[10px] text-slate-400 md:text-right">Ads help keep image generation free</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Browser Storage Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[110] bg-[#121417] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Gallery Header */}
            <div className="p-4 md:p-6 flex justify-between items-center border-b border-white/10 z-10 shrink-0 bg-slate-900 shadow-xl">
               <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
                    <Database size={20} />
                 </div>
                 <div className="flex-1">
                   <h2 className="text-sm font-black uppercase tracking-widest text-white">Browser Storage</h2>
                   <p className="text-[10px] text-slate-400 font-bold">Local Data Management</p>
                 </div>
                 <button onClick={() => setIsGalleryOpen(false)} className="md:hidden p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 ml-auto">
                    <X size={20} />
                 </button>
               </div>
               
               {/* Desktop Section: Search Bar + Ads */}
               <div className="hidden md:flex items-center gap-4 flex-1 mx-8">
                  {/* Search Bar - Desktop */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Search size={16} className="text-slate-500" />
                    </div>
                    <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search by title or prompt keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2 border border-white/10 rounded-xl leading-5 bg-black/30 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-2 flex items-center justify-center p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  </div>

                  {/* Ads - Desktop 728x90 */}
                  {SHOW_ADS && (
                    <div className="w-[728px] h-[90px] rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-center shrink-0">
                      <div className="text-center">
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Ads support AI</div>
                        <div className="text-xs font-black text-slate-300">728 x 90</div>
                      </div>
                    </div>
                  )}
               </div>

               <button onClick={() => setIsGalleryOpen(false)} className="hidden md:block p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 shrink-0">
                  <X size={24} />
               </button>
            </div>

            {/* Gallery Controls */}
            <div className="px-4 md:px-6 py-4 bg-white/5 border-b border-white/5 flex flex-col md:flex-row md:items-center gap-4 shrink-0">
              {/* Mobile Ads - 320x100 */}
              {SHOW_ADS && (
                <div className="md:hidden w-full rounded-xl bg-slate-800/50 border border-white/5 p-3 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Ads support AI</div>
                    <div className="text-xs font-black text-slate-300">320 x 100</div>
                  </div>
                </div>
              )}

              {/* Search Bar - Mobile */}
              <div className="md:hidden relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Search size={14} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-black/30 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs transition-all"
                  />
              </div>
              
              <div className="w-full md:flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-3 overflow-x-auto pb-1 md:pb-0 custom-scrollbar shrink-0">
                 <select 
                   value={activeFolder} 
                   onChange={(e) => setActiveFolder(e.target.value)}
                   className="bg-slate-900 border border-white/10 text-[10px] text-white font-bold uppercase rounded-lg px-3 py-2 outline-none focus:border-indigo-500 cursor-pointer"
                 >
                    <option value="All">All Folders</option>
                    {folders.map(f => <option key={f} value={f}>{f}</option>)}
                 </select>
                 
                 <select 
                   value={gallerySortBy} 
                   onChange={(e) => setGallerySortBy(e.target.value)}
                   className="bg-slate-900 border border-white/10 text-[10px] text-white font-bold uppercase rounded-lg px-3 py-2 outline-none focus:border-indigo-500 cursor-pointer"
                 >
                    <option value="Newest">Sort: Newest</option>
                    <option value="Oldest">Sort: Oldest</option>
                    <option value="Best">Sort: Best (Favs)</option>
                 </select>

                 <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>
                 
                 <div className="flex items-center gap-2">
                   <input 
                     type="text" 
                     placeholder="New Folder..." 
                     value={newFolderName}
                     onChange={(e)=>setNewFolderName(e.target.value)}
                     className="bg-slate-900 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none w-28 md:w-32"
                     onKeyPress={(e) => e.key === 'Enter' && createNewFolder()}
                   />
                   <button onClick={createNewFolder} className="p-1.5 bg-indigo-600 rounded-lg hover:bg-indigo-500 text-white"><FolderPlus size={14} /></button>
                 </div>
              </div>

              <div className="w-full md:w-auto flex items-center gap-2 shrink-0 overflow-x-auto pb-1 md:pb-0">
                 <input type="file" accept=".json" onChange={importStorageJSON} className="hidden" ref={storageImportRef} />
                 <input type="file" accept=".json,.xlsx,.xls" onChange={importGalleryFromExcel} className="hidden" ref={galleryExcelInputRef} />
                 <button onClick={() => exportStorageJSON()} className="px-3 md:px-2 py-2 text-[10px] text-white font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"><ArrowDownToLine size={14} /> <span className="hidden md:inline">Backup</span></button>
                 <button onClick={() => storageImportRef.current?.click()} className="px-3 md:px-2 py-2 text-[10px] text-white font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"><ArrowUpFromLine size={14} /> <span className="hidden md:inline">Restore</span></button>
                 <button onClick={() => galleryExcelInputRef.current?.click()} className="px-3 md:px-2 py-2 text-[10px] text-white font-bold uppercase tracking-wider bg-sky-600 hover:bg-sky-500 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"><Download size={14} /> <span className="hidden md:inline">Excel → Gallery</span></button>
                 <button onClick={exportGalleryToExcel} className="px-3 md:px-2 py-2 text-[10px] text-white font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"><FileSpreadsheet size={14} /> <span className="hidden md:inline">Gallery → Excel</span></button>
                 <button onClick={clearStorage} className="px-3 md:px-2 py-2 text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"><Trash size={14} /> <span className="hidden md:inline">Clear</span></button>
              </div>
            </div>

            {/* Prompt List (Horizontal Scroll Desktop, Vertical Mobile) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden md:overflow-y-hidden md:overflow-x-auto p-4 md:p-8 bg-[#08090a]">
               {filteredAndSortedPrompts.length === 0 ? (
                 <div className="flex h-full w-full items-center justify-center text-slate-500">
                    <div className="text-center">
                       <Search size={48} className="mx-auto mb-4 opacity-20" />
                       <p className="text-sm font-bold uppercase tracking-widest">No prompts found</p>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col md:flex-row h-auto md:h-full gap-6 pb-20 md:pb-0 font-sans items-start md:items-stretch">
                   {filteredAndSortedPrompts.map(prompt => (
                      <div key={prompt.id} className="bg-slate-900 border border-white/5 rounded-3xl p-4 flex flex-col gap-4 group relative transition-all hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 w-full min-h-[500px] md:min-h-0 md:w-[320px] lg:w-[350px] md:h-full shrink-0">
                        <div className="flex justify-between items-start gap-3">
                           <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-1">
                               {prompt.isFavorite && <Star size={14} className="text-yellow-400 fill-yellow-400 shrink-0" />}
                               <h3 className="text-base font-black truncate text-white">{prompt.title}</h3>
                             </div>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{new Date(prompt.timestamp).toLocaleString()}</p>
                           </div>
                           
                           <button onClick={() => toggleStar(prompt.id)} className={`p-2 rounded-xl transition-colors ${prompt.isFavorite ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-500 hover:bg-white/10'}`}>
                             <Star size={18} className={prompt.isFavorite ? "fill-yellow-400" : ""} />
                           </button>
                        </div>

                        {/* Visual Blueprint Render */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                           {(!prompt.entities || prompt.entities.length === 0) ? (
                              <p className="text-sm text-slate-500 italic p-4">Empty workflow...</p>
                           ) : (
                              prompt.entities.map(ent => {
                                 const selectedItems = ent.items.filter(i => i.selected);
                                 if (selectedItems.length === 0) return null;

                                 let bgClass = 'bg-slate-800';
                                 switch (ent.type) {
                                   case 'character': bgClass = 'bg-[#ea580c]'; break;
                                   case 'interaction': bgClass = 'bg-[#dc2626]'; break;
                                   case 'environment': bgClass = 'bg-[#2563eb]'; break;
                                   case 'motion': bgClass = 'bg-[#9333ea]'; break;
                                   case 'camera': bgClass = 'bg-[#4f46e5]'; break;
                                   case 'sequence': bgClass = 'bg-[#059669]'; break;
                                   case 'style': bgClass = 'bg-[#db2777]'; break;
                                   case 'magic': bgClass = 'bg-[#10b981]'; break;
                                   case 'negative': bgClass = 'bg-[#334155]'; break;
                                 }

                                 return (
                                   <div key={ent.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                      <div className={`${bgClass} px-3 py-2 flex gap-2 items-center`}>
                                         <GripVertical size={14} className="text-white/50 shrink-0" />
                                         {getIcon(ent.type)}
                                         <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none mt-0.5">{ent.name}</span>
                                      </div>
                                      <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                         {selectedItems.map((item, idx) => (
                                            <div key={item.id} className={`flex items-start gap-3 px-3 py-2 ${idx !== selectedItems.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                               <CheckCircle2 size={14} className={`${ent.type === 'negative' ? 'text-slate-500' : 'text-orange-600'} mt-0.5 shrink-0`} />
                                               <span className="text-sm text-slate-800 font-medium leading-tight">{item.text}</span>
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                 );
                              })
                           )}
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 shrink-0">
                           <div className="flex items-center gap-2 flex-1 min-w-0 shrink-0 bg-white/5 px-3 py-2 rounded-xl">
                             <Folder size={14} className="text-slate-500 shrink-0" />
                             <select 
                               value={prompt.folder}
                               onChange={(e) => updateSavedFolder(prompt.id, e.target.value)}
                               className="bg-transparent text-[11px] text-slate-300 font-bold outline-none cursor-pointer w-full truncate"
                             >
                               {folders.map(f => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
                             </select>
                           </div>

                           <div className="flex items-center gap-2 shrink-0">
                             <button onClick={() => deleteSaved(prompt.id)} className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors" title="Delete Prompt">
                               <Trash size={18} />
                             </button>
                             <button onClick={() => loadSaved(prompt)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg active:scale-95">
                               Load
                             </button>
                           </div>
                        </div>
                      </div>
                   ))}
                 </div>
               )}
            </div>
        </div>
      )}

      {/* Recipe Card Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md max-h-[90vh] flex flex-col relative shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header (Fixed) */}
            <div className="p-6 flex justify-between items-center bg-white rounded-t-[2.5rem] z-10 border-b border-slate-50">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} /> Mapping AI Prompt
              </div>
              <button 
                onClick={() => setShowRecipeModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                title="Close"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Body (Scrollable Card) */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50 space-y-4">
              {/* Recipe Title Input */}
              <div className="px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Name your creation</label>
                <input 
                  type="text" 
                  value={recipeTitle}
                  onChange={(e) => setRecipeTitle(e.target.value)}
                  placeholder="e.g. Neon Ninja Blueprint"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                />
              </div>

              <div id="recipe-card-content" className="bg-[#FAF9F6] border-2 border-slate-100 rounded-[2rem] p-8 shadow-inner relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full -mr-16 -mt-16 blur-3xl overflow-hidden"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100/30 rounded-full -ml-16 -mb-16 blur-3xl overflow-hidden"></div>

                <div className="relative space-y-6">
                  <div className="text-center space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 leading-tight break-words px-2">{recipeTitle || 'Visual Blueprint'}</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Recipe ID: {recipeId}</p>
                  </div>

                  <div className="h-px bg-slate-200 w-full"></div>

                  <div className="space-y-4">
                    {entities.filter(e => e.items.some(i => i.selected)).slice(0, 5).map(entity => (
                      <div key={entity.id} className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100 shrink-0 mt-0.5">
                           {getIcon(entity.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{entity.name}</p>
                          <p className="text-sm font-bold text-slate-800 break-words leading-snug">{entity.items.filter(i => i.selected).map(i => i.text).join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                     <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Final Formula</p>
                     <p className="text-[11px] font-serif italic leading-relaxed text-slate-700 break-words">
                       {finalPrompt}
                     </p>
                  </div>

                  <div className="text-center pt-2">
                     <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.15em] opacity-80">Crafted at mappingaiprompt.vercel.app</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer (Fixed Actions) */}
            <div className="p-6 bg-white border-t border-slate-50 rounded-b-[2.5rem]">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={downloadRecipeCard}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  <Share2 size={18} /> DOWNLOAD MAGIC CARD
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">Share your vision with the world</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}