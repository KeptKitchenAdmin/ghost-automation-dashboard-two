/**
 * 🎬 VIRAL CAPCUT ASSEMBLY SYSTEM
 * Automates CapCut video creation for maximum viral potential
 * Focus: Quick cuts, suspenseful pacing, addictive content structure
 */

interface MusicLibrary {
  suspenseful_buildup: string[];
  dramatic_reveal: string[];
  engagement_hook: string[];
}

interface TextStyle {
  font: string;
  size: string;
  color: string;
  stroke: string;
  position: string;
  animation: string;
}

interface ZoomEffect {
  start_scale: number;
  end_scale: number;
  focus_point: string;
}

interface VisualSegment {
  image: string;
  zoom_effect: ZoomEffect;
  filter: string;
}

interface AudioSegment {
  track: string;
  volume: number;
  fade_in: number;
  fade_out: number;
}

interface TimelineSegment {
  start_time: number;
  end_time: number;
  purpose: string;
  visual: VisualSegment;
  audio: AudioSegment;
  text_overlays: Array<{
    text: string;
    style: string;
    start_time: number;
    duration: number;
  }>;
  transitions: {
    entry: string;
    exit: string;
  };
}

interface ViralTimeline {
  total_duration: number;
  segments: TimelineSegment[];
}

interface ContentPackage {
  images: string[];
  hook: {
    hook: string;
    shock_stat: string;
    emotional_trigger: string;
  };
  engagement: {
    comment_prompt: string;
    follow_cta: string;
    urgency_element: string;
  };
}

export class ViralCapCutAssembly {
  private viralMusicLibrary: MusicLibrary;
  private viralTextStyles: Record<string, TextStyle>;

  constructor() {
    this.viralMusicLibrary = {
      suspenseful_buildup: [
        'Dark Mystery - CapCut',
        'Conspiracy Theory - CapCut',
        'Thriller Suspense - CapCut',
        'Investigation Theme - CapCut',
        'Hidden Truth - CapCut'
      ],
      dramatic_reveal: [
        'Epic Revelation - CapCut',
        'Shocking Discovery - CapCut',
        'Truth Unveiled - CapCut',
        'Documentary Drama - CapCut',
        'Exposé Theme - CapCut'
      ],
      engagement_hook: [
        'Cliffhanger - CapCut',
        'Call to Action - CapCut',
        'Follow Me - CapCut',
        'More Coming - CapCut',
        'Stay Tuned - CapCut'
      ]
    };

    this.viralTextStyles = {
      hook_text: {
        font: 'Impact Bold',
        size: '48px',
        color: '#FFFFFF',
        stroke: '#000000 3px',
        position: 'center_top',
        animation: 'Type Writer'
      },
      shock_stat: {
        font: 'Arial Black',
        size: '42px',
        color: '#FFFF00',
        stroke: '#FF0000 2px',
        position: 'center_middle',
        animation: 'Zoom In'
      },
      document_highlight: {
        font: 'Courier New',
        size: '36px',
        color: '#FF0000',
        stroke: '#000000 2px',
        position: 'bottom_center',
        animation: 'Slide Up'
      },
      cta_text: {
        font: 'Montserrat Bold',
        size: '40px',
        color: '#00FF00',
        stroke: '#000000 3px',
        position: 'bottom_center',
        animation: 'Bounce'
      }
    };
  }

  createViralTimeline(contentPackage: ContentPackage): ViralTimeline {
    const { images, hook, engagement } = contentPackage;
    
    const timeline: ViralTimeline = {
      total_duration: 30, // Perfect TikTok length for viral content
      segments: []
    };

    // SEGMENT 1: HOOK (0-3 seconds) - MOST CRITICAL
    const hookSegment: TimelineSegment = {
      start_time: 0,
      end_time: 3,
      purpose: 'GRAB ATTENTION IMMEDIATELY',
      visual: {
        image: images[0] || 'placeholder_shocking_document.jpg',
        zoom_effect: {
          start_scale: 1.0,
          end_scale: 1.3,
          focus_point: 'most_shocking_detail'
        },
        filter: 'High Contrast + Vintage'
      },
      audio: {
        track: this.viralMusicLibrary.suspenseful_buildup[0],
        volume: 0.7,
        fade_in: 0.2,
        fade_out: 0.3
      },
      text_overlays: [
        {
          text: hook.hook,
          style: 'hook_text',
          start_time: 0.5,
          duration: 2.5
        }
      ],
      transitions: {
        entry: 'Fade In',
        exit: 'Quick Cut'
      }
    };

    // SEGMENT 2: SHOCK REVELATION (3-8 seconds)
    const shockSegment: TimelineSegment = {
      start_time: 3,
      end_time: 8,
      purpose: 'DELIVER SHOCKING INFORMATION',
      visual: {
        image: images[1] || 'document_evidence.jpg',
        zoom_effect: {
          start_scale: 1.2,
          end_scale: 1.5,
          focus_point: 'key_statistic'
        },
        filter: 'Dramatic + Red Tint'
      },
      audio: {
        track: this.viralMusicLibrary.dramatic_reveal[0],
        volume: 0.8,
        fade_in: 0.5,
        fade_out: 0.5
      },
      text_overlays: [
        {
          text: hook.shock_stat,
          style: 'shock_stat',
          start_time: 3.5,
          duration: 2.0
        },
        {
          text: hook.emotional_trigger,
          style: 'document_highlight',
          start_time: 6.0,
          duration: 2.0
        }
      ],
      transitions: {
        entry: 'Flash Cut',
        exit: 'Zoom Transition'
      }
    };

    // SEGMENT 3: EVIDENCE BUILDUP (8-18 seconds)
    const evidenceSegment: TimelineSegment = {
      start_time: 8,
      end_time: 18,
      purpose: 'BUILD CREDIBILITY AND SUSPENSE',
      visual: {
        image: images[2] || 'additional_documents.jpg',
        zoom_effect: {
          start_scale: 1.0,
          end_scale: 1.4,
          focus_point: 'critical_information'
        },
        filter: 'Documentary Style'
      },
      audio: {
        track: this.viralMusicLibrary.suspenseful_buildup[1],
        volume: 0.6,
        fade_in: 1.0,
        fade_out: 1.0
      },
      text_overlays: [
        {
          text: "But that's not all...",
          style: 'hook_text',
          start_time: 9.0,
          duration: 2.0
        },
        {
          text: "The evidence shows...",
          style: 'document_highlight',
          start_time: 12.0,
          duration: 3.0
        },
        {
          text: engagement.urgency_element,
          style: 'shock_stat',
          start_time: 16.0,
          duration: 2.0
        }
      ],
      transitions: {
        entry: 'Slide In',
        exit: 'Glitch Transition'
      }
    };

    // SEGMENT 4: CLIMAX & REVELATION (18-25 seconds)
    const climaxSegment: TimelineSegment = {
      start_time: 18,
      end_time: 25,
      purpose: 'DELIVER MAIN REVELATION',
      visual: {
        image: images[0] || 'final_proof.jpg', // Cycle back for emphasis
        zoom_effect: {
          start_scale: 1.5,
          end_scale: 2.0,
          focus_point: 'smoking_gun_evidence'
        },
        filter: 'High Drama + Color Pop'
      },
      audio: {
        track: this.viralMusicLibrary.dramatic_reveal[1],
        volume: 0.9,
        fade_in: 0.5,
        fade_out: 0.8
      },
      text_overlays: [
        {
          text: "This changes everything",
          style: 'shock_stat',
          start_time: 19.0,
          duration: 2.5
        },
        {
          text: engagement.comment_prompt,
          style: 'hook_text',
          start_time: 22.0,
          duration: 3.0
        }
      ],
      transitions: {
        entry: 'Dramatic Zoom',
        exit: 'Quick Flash'
      }
    };

    // SEGMENT 5: CALL TO ACTION (25-30 seconds)
    const ctaSegment: TimelineSegment = {
      start_time: 25,
      end_time: 30,
      purpose: 'DRIVE ENGAGEMENT AND FOLLOWS',
      visual: {
        image: 'follow_screen_graphic.jpg',
        zoom_effect: {
          start_scale: 1.0,
          end_scale: 1.1,
          focus_point: 'center'
        },
        filter: 'Bright + Engaging'
      },
      audio: {
        track: this.viralMusicLibrary.engagement_hook[0],
        volume: 0.8,
        fade_in: 0.3,
        fade_out: 1.0
      },
      text_overlays: [
        {
          text: engagement.follow_cta,
          style: 'cta_text',
          start_time: 25.5,
          duration: 3.0
        },
        {
          text: "Part 2 coming tomorrow...",
          style: 'hook_text',
          start_time: 27.5,
          duration: 2.5
        }
      ],
      transitions: {
        entry: 'Bounce In',
        exit: 'Fade Out'
      }
    };

    timeline.segments = [hookSegment, shockSegment, evidenceSegment, climaxSegment, ctaSegment];
    return timeline;
  }

  generateCapCutInstructions(timeline: ViralTimeline): string {
    let instructions = "🎬 VIRAL CAPCUT ASSEMBLY INSTRUCTIONS\n";
    instructions += "=" + "=".repeat(50) + "\n\n";
    
    instructions += "📱 PROJECT SETUP:\n";
    instructions += "• Create new project in 9:16 aspect ratio\n";
    instructions += "• Set to 30 seconds duration\n";
    instructions += "• Enable auto-captions for accessibility\n\n";

    instructions += "🎵 AUDIO SETUP:\n";
    instructions += "• Import background music tracks\n";
    instructions += "• Set master volume to prevent clipping\n";
    instructions += "• Enable beat sync for cuts\n\n";

    timeline.segments.forEach((segment, index) => {
      instructions += `📽️ SEGMENT ${index + 1}: ${segment.purpose}\n`;
      instructions += `⏱️ Time: ${segment.start_time}s - ${segment.end_time}s\n\n`;
      
      instructions += "VISUAL:\n";
      instructions += `• Import: ${segment.visual.image}\n`;
      instructions += `• Add filter: ${segment.visual.filter}\n`;
      instructions += `• Zoom: ${segment.visual.zoom_effect.start_scale}x → ${segment.visual.zoom_effect.end_scale}x\n`;
      instructions += `• Focus: ${segment.visual.zoom_effect.focus_point}\n\n`;
      
      instructions += "AUDIO:\n";
      instructions += `• Track: ${segment.audio.track}\n`;
      instructions += `• Volume: ${segment.audio.volume * 100}%\n`;
      instructions += `• Fade in: ${segment.audio.fade_in}s\n`;
      instructions += `• Fade out: ${segment.audio.fade_out}s\n\n`;
      
      instructions += "TEXT OVERLAYS:\n";
      segment.text_overlays.forEach((overlay, i) => {
        const style = this.viralTextStyles[overlay.style];
        instructions += `${i + 1}. "${overlay.text}"\n`;
        instructions += `   • Font: ${style.font}\n`;
        instructions += `   • Size: ${style.size}\n`;
        instructions += `   • Color: ${style.color}\n`;
        instructions += `   • Animation: ${style.animation}\n`;
        instructions += `   • Time: ${overlay.start_time}s for ${overlay.duration}s\n\n`;
      });
      
      instructions += "TRANSITIONS:\n";
      instructions += `• Entry: ${segment.transitions.entry}\n`;
      instructions += `• Exit: ${segment.transitions.exit}\n\n`;
      instructions += "-".repeat(50) + "\n\n";
    });

    instructions += "🚀 VIRAL OPTIMIZATION CHECKLIST:\n";
    instructions += "✅ Hook grabs attention in first 2 seconds\n";
    instructions += "✅ Quick cuts every 3-5 seconds\n";
    instructions += "✅ Text is large and readable on mobile\n";
    instructions += "✅ Music builds suspense and emotion\n";
    instructions += "✅ Strong call-to-action at end\n";
    instructions += "✅ Cliffhanger for follow-up content\n";
    instructions += "✅ Optimized for mobile viewing\n";
    instructions += "✅ Captions enabled for silent viewing\n\n";

    instructions += "📊 EXPORT SETTINGS:\n";
    instructions += "• Resolution: 1080x1920 (9:16)\n";
    instructions += "• Frame rate: 30fps\n";
    instructions += "• Quality: High\n";
    instructions += "• Format: MP4\n";
    instructions += "• Remove watermark if possible\n";

    return instructions;
  }

  createMultiPartSeries(contentPackages: ContentPackage[]): ViralTimeline[] {
    const series: ViralTimeline[] = [];
    
    contentPackages.forEach((package_, index) => {
      const timeline = this.createViralTimeline(package_);
      
      // Modify for series continuity
      if (index > 0) {
        // Add "Part X" to hook
        timeline.segments[0].text_overlays[0].text = `Part ${index + 1}: ${timeline.segments[0].text_overlays[0].text}`;
      }
      
      if (index < contentPackages.length - 1) {
        // Update CTA for next part
        const ctaSegment = timeline.segments[timeline.segments.length - 1];
        ctaSegment.text_overlays[1].text = `Part ${index + 2} drops tomorrow...`;
      }
      
      series.push(timeline);
    });
    
    return series;
  }

  getViralOptimizationTips(): string[] {
    return [
      "🎯 Hook viewers within 1.5 seconds or they'll scroll",
      "⚡ Cut every 2-3 seconds to maintain attention",
      "📱 Test on mobile - 90% of viewers use phones",
      "🔊 Add captions - 85% watch without sound initially",
      "🎵 Sync cuts to music beats for psychological engagement",
      "📈 Use red arrows and highlights to guide attention",
      "💬 End with questions to boost comment engagement",
      "🔥 Create urgency with phrases like 'before it gets deleted'",
      "👥 Include face reveals or reactions for human connection",
      "📊 A/B test different hooks to find what works best"
    ];
  }
}