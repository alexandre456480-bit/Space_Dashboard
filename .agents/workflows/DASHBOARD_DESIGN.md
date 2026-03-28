---
description: Definir um sistema completo de design para dashboards, incluindo gráficos (charts), cards e KPIs, garantindo consistência visual, alto nível de UI/UX e aparência moderna e premium.
---

# SKILL: ADVANCED DASHBOARD SYSTEM
VERSION: 1.0
PRIORITY: HIGH

## OBJECTIVE

Definir um sistema completo de design para dashboards, incluindo gráficos (charts), cards e KPIs, garantindo consistência visual, alto nível de UI/UX e aparência moderna e premium.

---

## CORE RULES

- Todo o design deve ser moderno, elegante e diferenciado
- Evitar qualquer aparência genérica ou simples
- Priorizar experiência do usuário (UX) e impacto visual
- Manter consistência entre todos os elementos
- Código deve ser clean, modular e otimizado
- Os gráficos devem ser do ECharts obrigatoriamente

---

## TECHNOLOGY STACK (REQUIRED)

- Apache ECharts (obrigatório para gráficos)
- HTML
- CSS
- JavaScript

---

## COLOR SYSTEM (DYNAMIC)

- Todas as cores devem ser baseadas na paleta enviada pelo usuário
- Sempre utilizar gradients
- Criar variações automáticas:
  - glow
  - transparência
  - contraste

- Usar cores semânticas quando aplicável:
  - positivo: verde
  - negativo: vermelho
  - neutro: azul ou cinza

---

# CHART SYSTEM (GRÁFICOS)

## RULES

- Todos os gráficos devem utilizar Apache ECharts obrigatoriamente

## BACKGROUND STYLE (REQUIRED)

- Glassmorphism:
  - background transparente
  - backdrop-filter: blur

- Gradient background (obrigatório)
- Border-radius moderno (16px+)

## VISUAL EFFECTS

- Neon glow (baseado na cor principal)
- Shadow:
  - bem visível
  - suave e difusa

- Neuromorphism:
  - leve profundidade
  - contraste entre luz e sombra

## BORDER

- Pode incluir:
  - gradient border
  - glow nas bordas

## HOVER EFFECTS

- Scale leve
- Glow intensificado
- Transição suave

- Usar:
  - transform
  - opacity

---

# CARD SYSTEM

## OBJECTIVE

Cards devem destacar informações importantes com forte identidade visual e leitura rápida.

---

## STYLE (REQUIRED)

- Seguir o mesmo padrão dos gráficos:
  - Glassmorphism
  - Gradient
  - Shadow
  - Neon glow
  - Neuromorphism

- Border-radius moderno
- Fundo com leve transparência + blur

---

## ICON SYSTEM (REQUIRED)

- Utilizar Lucide icons obrigatoriamente

## ICON STYLE

- Aplicar Fake 3D:
  - perspective
  - rotation leve
  - depth visual

- Efeitos:
  - glow
  - hover animation
  - scale

---

## COLOR RULES

- Cores devem ser marcantes e semânticas

Exemplo:

- Receita → verde
- Despesa → vermelho
- Usuários → azul

### Aplicação:

- Cor no ícone
- Cor no texto principal
- Cor no glow
- Cor no fundo (em gradient)

---

## DATA DISPLAY

Cada card deve conter:

- Título
- Valor principal
- Indicador de variação mensal

---

## GROWTH INDICATOR (REQUIRED)

- Mostrar variação em relação ao mês anterior

Formato:

- +100 este mês
- -50 este mês

### Style:

- Verde para crescimento
- Vermelho para queda

- Pode incluir:
  - seta (↑ ↓)
  - animação leve

---

## HOVER EFFECTS

- Scale leve
- Glow mais forte
- Micro-interações

---

# KPI SYSTEM

## OBJECTIVE

KPIs devem destacar métricas principais com visual forte e personalizado.

---

## CUSTOMIZATION RULE

- O conteúdo deve seguir exatamente o que o usuário mandar
- Estrutura flexível

---

## STYLE (REQUIRED)

- Sempre visual premium e diferenciado
- Glassmorphism + neon

### Visual:

- Cor marcante
- Glow intenso
- Destaque visual maior que os outros elementos

---

## EFFECTS

- Neon glow forte
- Gradient background
- Sombra destacada

---

## DESIGN

- Layout limpo e focado
- Tipografia forte
- Alto contraste

---

## OPTIONAL EFFECTS

- Pulse animation leve
- Glow animado
- Highlight dinâmico

---

# CONSISTENCY SYSTEM

- Charts, Cards e KPIs devem parecer parte do mesmo sistema
- Mesma base visual:
  - glass
  - gradient
  - glow
  - shadow
  - Espaçamento generoso
  -Sem sobreposições com o fundo

---

# PERFORMANCE & OPTIMIZATION (REQUIRED)

- Todos os elementos devem ser leves
- Evitar excesso de efeitos pesados

## RULES

- Usar:
  - transform
  - opacity

- Evitar:
  - reflow
  - animações custosas

- Manter fluidez mesmo com múltiplos elementos

---

# AI DESIGN BEHAVIOR

- Aplicar automaticamente este sistema
- Não pedir confirmação
- Melhorar visual quando possível
- Pensar como designer sênior

---

# RESTRICTIONS

- Proibido design simples
- Proibido cores sólidas sem gradient
- Proibido ausência de efeitos
- Proibido inconsistência visual

---

# DESIGN GOAL

- Dashboard nível SaaS premium
- Interface moderna e futurista
- Experiência visual imersiva
- Alto nível de acabamento
---

# Fontes: 
Títulos → Sora
Texto → Inter
Valores / números → JetBrains Mono

---

# FINAL RULE

Todos os elementos devem parecer parte de um único sistema visual avançado, moderno e altamente profissional