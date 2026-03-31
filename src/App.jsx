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
  Link
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

const SHOW_ADS = false; // Toggle this to true when you want to show ads

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
                  className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100"
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
  const [recipeTitle, setRecipeTitle] = useState('Visual Blueprint');
  const [sourceLanguage, setSourceLanguage] = useState('id');
  const fileInputRef = useRef(null);

  const PHOTO_MAGIC = ["8k resolution", "extremely detailed", "photorealistic", "cinematic lighting", "ray tracing", "sharp focus", "masterpiece", "octane render", "stunning composition", "vivid colors", "highly intricate details"];
  const VIDEO_MAGIC = ["high framerate", "fluid motion", "professional color grading", "smooth transitions", "RAW video", "motion blur", "natural physics", "flawless camera movement", "cinematic motion", "high dynamic range"];

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

    let finalOutput = promptParts.join('. ').replace(/\.\./g, '.').trim();
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

  const handleTranslate = async () => {
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
    const newTemplate = JSON.parse(JSON.stringify(filtered[randomIdx].data));
    const freshened = newTemplate.map(ent => ({
      ...ent,
      id: `entity-${Date.now()}-${Math.random()}`,
      items: ent.items.map(it => ({ ...it, id: `item-${Date.now()}-${Math.random()}` }))
    }));
    setEntities(freshened);
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
    
    // Pick 4-5 random items from the pool
    const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    setEntities(prev => {
      const magicEntity = prev.find(e => e.type === 'magic');
      const newItems = selected.map(text => ({ id: `item-${Date.now()}-${Math.random()}`, text, selected: true }));
      
      if (magicEntity) {
        return prev.map(e => e.type === 'magic' ? { ...e, items: newItems } : e);
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

  const exportData = () => {
    const rows = [];
    entities.forEach(entity => {
      if (entity.items.length === 0) {
        rows.push({
          Section: entity.name,
          Field: '',
          Selected: ''
        });
      } else {
        entity.items.forEach(item => {
          rows.push({
            Section: entity.name,
            Field: item.text,
            Selected: item.selected
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prompt Map");
    XLSX.writeFile(workbook, "prompt_map.xlsx");
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          setEntities(imported);
          setTranslatedPrompt('');
        } catch (err) {
          setError("File format not supported in this preview.");
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
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const entityMap = new Map();

        rows.forEach(row => {
          if (!row.Section) return;

          if (!entityMap.has(row.Section)) {
            const lowerName = row.Section.toLowerCase();
            let inferredType = 'character';
            if (lowerName.includes('interaction') || lowerName.includes('interaksi')) inferredType = 'interaction';
            else if (lowerName.includes('environment') || lowerName.includes('lingkungan') || lowerName.includes('env')) inferredType = 'environment';
            else if (lowerName.includes('motion') || lowerName.includes('pergerakan') || lowerName.includes('gerak')) inferredType = 'motion';
            else if (lowerName.includes('camera') || lowerName.includes('kamera')) inferredType = 'camera';
            else if (lowerName.includes('sequence') || lowerName.includes('timeline') || lowerName.includes('urutan')) inferredType = 'sequence';
            else if (lowerName.includes('style') || lowerName.includes('gaya') || lowerName.includes('visual')) inferredType = 'style';
            else if (lowerName.includes('negative') || lowerName.includes('negatif')) inferredType = 'negative';

            entityMap.set(row.Section, {
              id: `entity-${Date.now()}-${Math.random()}`,
              name: row.Section,
              type: inferredType,
              isOpen: true,
              items: []
            });
          }

          if (row.Field) {
            entityMap.get(row.Section).items.push({
              id: `item-${Date.now()}-${Math.random()}`,
              text: row.Field,
              selected: row.Selected !== false && String(row.Selected).toLowerCase() !== 'false'
            });
          }
        });

        setEntities(Array.from(entityMap.values()));
        setTranslatedPrompt('');
      } catch (err) {
        setError("Failed to parse Excel file.");
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
                <div className="p-1.5 bg-slate-900 rounded-lg rotate-3"><Sparkles className="text-white" size={16} /></div>
                Mapping AI Prompt
              </h1>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap pb-3 border-b border-slate-50">
                <button onClick={() => loadRandomTemplate('image')} className="px-4 py-2 bg-purple-600 text-white border border-purple-500 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-purple-700 transition-all shadow-md active:scale-95"><ImageIcon size={14} /> Random Image</button>
                <button onClick={() => loadRandomTemplate('video')} className="px-4 py-2 bg-indigo-600 text-white border border-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md active:scale-95"><Video size={14} /> Random Video</button>
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

            <div className="flex gap-3 pt-2 border-t border-slate-50">
              <input type="file" ref={fileInputRef} onChange={importData} accept=".json, .xlsx, .xls" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                <Download size={14} /> Import Map
              </button>
              <button onClick={exportData} className="flex-1 py-2 bg-slate-50 border border-slate-200 text-green-600 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                <FileSpreadsheet size={14} /> Export Map
              </button>
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

        <div className="lg:col-span-5 lg:sticky lg:top-6 h-fit space-y-6">
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
                    <option key={lang.code} value={lang.code} style={{ background: '#1e293b', color: 'white' }}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative group/tooltip">
                  <button
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isTranslating ? <Loader2 size={14} className="animate-spin text-white" /> : <Languages size={14} className="text-white" />}
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
                  {!isCopied && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-28 p-1.5 bg-slate-900 text-white text-[9px] font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-[100] shadow-xl border border-white/10 text-center leading-tight">
                      Copy to clipboard
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-6 border-transparent border-b-slate-900"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-[250px] bg-white/5 rounded-xl p-5 border border-white/10 italic font-serif leading-relaxed text-base relative">
              {error && <div className="text-red-400 text-[10px] mb-2">{error}</div>}
              {finalPrompt || "Add a character to get started..."}
            </div>
          </div>


        </div>
      </div>
    </main>

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
          <div className="space-y-6 md:text-right flex flex-col md:items-end">
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
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">Mapping AI Prompt</span>
              <span className="text-[9px] font-bold text-slate-600">&copy; 2026. All rights reserved.</span>
            </div>
          </div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
            Inspired by <a href="https://perchance.org/ai-text-to-image-generator" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-white/20">perchance.org</a>
          </div>
        </div>
      </footer>


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