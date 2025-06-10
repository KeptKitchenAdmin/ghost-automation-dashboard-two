export interface CapcutProject {
  id: string;
  title: string;
  duration: number;
  tracks: {
    video: VideoTrack[];
    audio: AudioTrack[];
    text: TextTrack[];
    effects: EffectTrack[];
  };
  settings: ProjectSettings;
}

export interface VideoClip {
  id: string;
  sourceUrl: string;
  startTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
  speed: number;
  transitions: Transition[];
}

export interface AudioTrack {
  id: string;
  clips: AudioClip[];
  volume: number;
  isMuted: boolean;
}

export interface AudioClip {
  id: string;
  sourceUrl: string;
  startTime: number;
  duration: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface TextTrack {
  id: string;
  elements: TextElement[];
}

export interface TextElement {
  id: string;
  text: string;
  startTime: number;
  duration: number;
  position: { x: number; y: number };
  style: TextStyle;
  animation: Animation;
}

export interface VideoTrack {
  id: string;
  clips: VideoClip[];
}

export interface EffectTrack {
  id: string;
  effects: Effect[];
}

export interface Effect {
  id: string;
  type: string;
  startTime: number;
  duration: number;
  parameters: Record<string, any>;
}

export interface Transition {
  type: string;
  duration: number;
  parameters: Record<string, any>;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  bold: boolean;
  italic: boolean;
  alignment: 'left' | 'center' | 'right';
  outline?: { color: string; width: number };
  shadow?: { color: string; blur: number; offsetX: number; offsetY: number };
}

export interface Animation {
  type: string;
  duration: number;
  parameters: Record<string, any>;
}

export interface ProjectSettings {
  resolution: { width: number; height: number };
  frameRate: number;
  aspectRatio: string;
  exportQuality: 'low' | 'medium' | 'high' | '4k';
}

export interface AssemblyInstruction {
  step: number;
  action: string;
  details: string;
  tips: string[];
}

export class ViralCapcutAssembly {
  private templates: Record<string, any>;
  private transitions: Record<string, Transition>;
  private textAnimations: Record<string, Animation>;
  private effects: Record<string, Effect>;

  constructor() {
    this.templates = {
      viral_hook: {
        structure: ['hook', 'problem', 'solution', 'proof', 'cta'],
        timing: { hook: 3, problem: 5, solution: 7, proof: 5, cta: 3 },
        transitions: ['zoom', 'slide', 'fade', 'glitch', 'none']
      },
      story_arc: {
        structure: ['setup', 'conflict', 'climax', 'resolution'],
        timing: { setup: 5, conflict: 7, climax: 8, resolution: 5 },
        transitions: ['cut', 'dissolve', 'wipe', 'spin']
      },
      product_showcase: {
        structure: ['attention', 'features', 'benefits', 'social_proof', 'offer'],
        timing: { attention: 3, features: 6, benefits: 6, social_proof: 5, offer: 4 },
        transitions: ['slide', 'zoom', 'flip', 'fade']
      }
    };

    this.transitions = {
      zoom: { type: 'zoom', duration: 0.3, parameters: { scale: 1.2 } },
      slide: { type: 'slide', duration: 0.4, parameters: { direction: 'left' } },
      fade: { type: 'fade', duration: 0.5, parameters: { opacity: 0 } },
      glitch: { type: 'glitch', duration: 0.2, parameters: { intensity: 0.8 } },
      cut: { type: 'cut', duration: 0, parameters: {} },
      dissolve: { type: 'dissolve', duration: 0.6, parameters: { softness: 0.5 } }
    };

    this.textAnimations = {
      typewriter: { type: 'typewriter', duration: 1.5, parameters: { speed: 0.05 } },
      bounce: { type: 'bounce', duration: 0.8, parameters: { height: 20 } },
      slide_in: { type: 'slide_in', duration: 0.5, parameters: { direction: 'bottom' } },
      fade_in: { type: 'fade_in', duration: 0.6, parameters: { opacity: 0 } },
      scale: { type: 'scale', duration: 0.4, parameters: { startScale: 0.5 } }
    };

    this.effects = {
      blur: { id: 'blur', type: 'blur', startTime: 0, duration: 1, parameters: { intensity: 0.5 } },
      vignette: { id: 'vignette', type: 'vignette', startTime: 0, duration: 1, parameters: { intensity: 0.3 } },
      color_grade: { id: 'color_grade', type: 'color_grade', startTime: 0, duration: 1, parameters: { preset: 'viral' } },
      slow_motion: { id: 'slow_motion', type: 'speed', startTime: 0, duration: 1, parameters: { speed: 0.5 } }
    };
  }

  createViralProject(
    title: string,
    clips: { url: string; duration: number }[],
    script: { text: string; timing: number }[],
    audioUrl: string,
    template: 'viral_hook' | 'story_arc' | 'product_showcase' = 'viral_hook'
  ): { project: CapcutProject; instructions: AssemblyInstruction[] } {
    const projectId = this.generateId();
    const templateData = this.templates[template];
    const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);
    
    const project: CapcutProject = {
      id: projectId,
      title,
      duration: totalDuration,
      tracks: {
        video: [this.createVideoTrack(clips, templateData.transitions)],
        audio: [this.createAudioTrack(audioUrl, totalDuration)],
        text: [this.createTextTrack(script)],
        effects: [this.createEffectsTrack(template, totalDuration)]
      },
      settings: {
        resolution: { width: 1080, height: 1920 },
        frameRate: 30,
        aspectRatio: '9:16',
        exportQuality: 'high'
      }
    };

    const instructions = this.generateInstructions(template, clips.length, script.length);

    return { project, instructions };
  }

  private createVideoTrack(clips: { url: string; duration: number }[], transitions: string[]): VideoTrack {
    const videoClips: VideoClip[] = [];
    let currentTime = 0;

    clips.forEach((clip, index) => {
      const transitionType = transitions[index % transitions.length];
      const transition = this.transitions[transitionType] || this.transitions.cut;

      videoClips.push({
        id: this.generateId(),
        sourceUrl: clip.url,
        startTime: currentTime,
        duration: clip.duration,
        inPoint: 0,
        outPoint: clip.duration,
        speed: 1,
        transitions: index > 0 ? [transition] : []
      });

      currentTime += clip.duration;
    });

    return { id: this.generateId(), clips: videoClips };
  }

  private createAudioTrack(audioUrl: string, duration: number): AudioTrack {
    return {
      id: this.generateId(),
      clips: [{
        id: this.generateId(),
        sourceUrl: audioUrl,
        startTime: 0,
        duration,
        volume: 0.8,
        fadeIn: 0.5,
        fadeOut: 0.5
      }],
      volume: 1,
      isMuted: false
    };
  }

  private createTextTrack(script: { text: string; timing: number }[]): TextTrack {
    const elements: TextElement[] = [];
    let currentTime = 0;

    script.forEach((line, index) => {
      const animations = Object.keys(this.textAnimations);
      const animation = this.textAnimations[animations[index % animations.length]];

      elements.push({
        id: this.generateId(),
        text: line.text,
        startTime: currentTime,
        duration: line.timing,
        position: { x: 540, y: 960 + (index % 3) * 100 },
        style: this.getTextStyle(index),
        animation
      });

      currentTime += line.timing;
    });

    return { id: this.generateId(), elements };
  }

  private createEffectsTrack(template: string, duration: number): EffectTrack {
    const effects: Effect[] = [];

    if (template === 'viral_hook') {
      effects.push({
        ...this.effects.color_grade,
        duration,
        parameters: { ...this.effects.color_grade.parameters, preset: 'vibrant' }
      });
    } else if (template === 'product_showcase') {
      effects.push({
        ...this.effects.vignette,
        duration,
        parameters: { ...this.effects.vignette.parameters, intensity: 0.4 }
      });
    }

    return { id: this.generateId(), effects };
  }

  private getTextStyle(index: number): TextStyle {
    const styles: TextStyle[] = [
      {
        fontFamily: 'Montserrat',
        fontSize: 72,
        color: '#FFFFFF',
        backgroundColor: '#000000CC',
        bold: true,
        italic: false,
        alignment: 'center',
        outline: { color: '#000000', width: 3 },
        shadow: { color: '#000000', blur: 10, offsetX: 2, offsetY: 2 }
      },
      {
        fontFamily: 'Arial Black',
        fontSize: 64,
        color: '#FFFF00',
        bold: true,
        italic: false,
        alignment: 'center',
        outline: { color: '#FF0000', width: 2 }
      },
      {
        fontFamily: 'Impact',
        fontSize: 80,
        color: '#00FF00',
        backgroundColor: '#000000AA',
        bold: false,
        italic: false,
        alignment: 'center'
      }
    ];

    return styles[index % styles.length];
  }

  private generateInstructions(template: string, clipCount: number, scriptLines: number): AssemblyInstruction[] {
    return [
      {
        step: 1,
        action: 'Import Media',
        details: `Import ${clipCount} video clips and 1 audio file into CapCut`,
        tips: ['Organize clips in order', 'Check audio quality', 'Ensure 9:16 aspect ratio']
      },
      {
        step: 2,
        action: 'Arrange Timeline',
        details: `Place clips according to ${template} template structure`,
        tips: ['Match cuts to beat', 'Keep hooks under 3 seconds', 'Overlap for transitions']
      },
      {
        step: 3,
        action: 'Add Text',
        details: `Add ${scriptLines} text elements with animations`,
        tips: ['Use contrasting colors', 'Keep text in safe zones', 'Time with speech']
      },
      {
        step: 4,
        action: 'Apply Transitions',
        details: 'Add transitions between clips',
        tips: ['Keep under 0.5 seconds', 'Match energy level', 'Test on mobile']
      },
      {
        step: 5,
        action: 'Color Grade',
        details: 'Apply color grading and effects',
        tips: ['Boost saturation 10-20%', 'Add slight vignette', 'Check skin tones']
      },
      {
        step: 6,
        action: 'Audio Mix',
        details: 'Balance audio levels and add sound effects',
        tips: ['Keep voice at -6db', 'Music at -12db', 'Add whoosh sounds']
      },
      {
        step: 7,
        action: 'Export',
        details: 'Export at 1080x1920, 30fps, High Quality',
        tips: ['Check file size < 287MB', 'Preview on phone', 'Save project file']
      }
    ];
  }

  generateBatchProjects(
    projects: Array<{
      title: string;
      clips: { url: string; duration: number }[];
      script: { text: string; timing: number }[];
      audioUrl: string;
      template?: 'viral_hook' | 'story_arc' | 'product_showcase';
    }>
  ): Array<{ project: CapcutProject; instructions: AssemblyInstruction[] }> {
    return projects.map(p => 
      this.createViralProject(p.title, p.clips, p.script, p.audioUrl, p.template)
    );
  }

  exportProjectFile(project: CapcutProject): string {
    return JSON.stringify(project, null, 2);
  }

  getOptimizationTips(project: CapcutProject): string[] {
    const tips: string[] = [];

    if (project.duration > 60) {
      tips.push('Consider shortening to under 60 seconds for better retention');
    }

    if (project.tracks.text[0]?.elements.length < 5) {
      tips.push('Add more text overlays to increase engagement');
    }

    if (!project.tracks.effects[0]?.effects.length) {
      tips.push('Add color grading or effects for visual appeal');
    }

    tips.push(
      'Hook viewers in first 3 seconds',
      'End with clear CTA',
      'Use trending audio when possible',
      'Add captions for accessibility',
      'Test different thumbnail frames'
    );

    return tips;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const viralCapcutAssembly = new ViralCapcutAssembly();