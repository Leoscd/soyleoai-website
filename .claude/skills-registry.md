# Skills Registry — SoyLeoAI.com
> Documento de registro de skills instaladas y pendientes.
> Cuando encuentres una skill en skills.sh, pegá el comando de instalación en la sección correspondiente.

---

## CÓMO USAR ESTE ARCHIVO

1. Buscás una skill en https://skills.sh
2. Copiás el comando de instalación (o la URL del .md)
3. Lo pegás en la sección correcta abajo
4. Le avisás a Claude Code: "instalá las skills del registry"

---

## SKILLS INSTALADAS

### Frontend & Diseño
| Skill | Comando slash | Estado | Instalada en agente |
|-------|--------------|--------|---------------------|
| audit-responsive | `/audit-responsive` | ✅ activa | responsive-layout-expert |

### SEO & Visibilidad
| Skill | Comando slash | Estado | Instalada en agente |
|-------|--------------|--------|---------------------|
| audit-seo | `/audit-seo` | ✅ activa (custom) | seo-specialist |
| schema-markup-generator | `/schema-markup` | ⏳ pendiente de instalar | seo-specialist |

### Performance & Velocidad
| Skill | Comando slash | Estado | Instalada en agente |
|-------|--------------|--------|---------------------|
| audit-performance | `/audit-performance` | ✅ activa (custom) | performance-optimizer |
| optimize-images | `/optimize-images` | ✅ activa (custom) | performance-optimizer |

### Seguridad
| Skill | Comando slash | Estado | Instalada en agente |
|-------|--------------|--------|---------------------|
| audit-security | `/audit-security` | ✅ activa (custom) | security-auditor |

### Analytics & Métricas
| Skill | Comando slash | Estado | Instalada en agente |
|-------|--------------|--------|---------------------|
| setup-analytics | `/setup-analytics` | ✅ activa (custom) | analytics-tracker |

### Contenido & Blog
| Skill | Comando slash | Estado | Instalada en agente |
|-------|--------------|--------|---------------------|
| — | — | ⏳ pendiente | content-manager |

---

## SKILLS PENDIENTES DE INSTALAR
> Pegá acá los comandos que encontrés en skills.sh

```bash
# SEO
npx skills add https://github.com/seo-skills/seo-audit-skill --skill seo-audit
# PERFORMANCE / LIGHTHOUSE
npx skills add https://github.com/jeremylongshore/claude-code-plugins-plus-skills --skill performance-lighthouse-runner
# SECURITY HEADERS
npx skills add https://github.com/aj-geddes/useful-ai-prompts --skill security-headers-configuration
# ANALYTICS / GA4
https://skills.sh/davila7/claude-code-templates/google-analytics #este es una url para que me digas si seá util esta herramienta o buscamos otra
# SCHEMA MARKUP / STRUCTURED DATA
npx skills add https://github.com/aaron-he-zhu/seo-geo-claude-skills --skill schema-markup-generator # debemos revisar cuando hailitar a eeste agente
# IMAGE OPTIMIZATION

# ACCESSIBILITY

# GIT WORKFLOW

```

---

## SKILLS DESCARTADAS
> Skills que evaluamos y decidimos no usar (con el motivo)

| Skill | Motivo del descarte |
|-------|---------------------|
| — | — |

---

*Última actualización: 10/03/2026*
