---
description: Garantir que todas as imagens e vídeos utilizados no projeto sejam automaticamente otimizados para máxima performance, mantendo alta qualidade visual e evitando qualquer tipo de travamento ou lentidão no site.
---

# SKILL: MEDIA OPTIMIZATION SYSTEM
VERSION: 1.0
PRIORITY: HIGH

## OBJECTIVE

Garantir que todas as imagens e vídeos utilizados no projeto sejam automaticamente otimizados para máxima performance, mantendo alta qualidade visual e evitando qualquer tipo de travamento ou lentidão no site.

---

## CORE RULES

- Todo arquivo de mídia deve ser otimizado antes de ser utilizado
- Priorizar performance sem comprometer qualidade perceptível
- Evitar uso de arquivos pesados ou não otimizados
- Sempre aplicar boas práticas modernas de web performance

---

## IMAGE OPTIMIZATION (REQUIRED)

### Formats:

- Prioridade:
  - WebP (default)
  - AVIF (quando suportado)

- Fallback:
  - PNG ou JPG apenas quando necessário

---

### Conversion Rules:

- Todas as imagens devem ser convertidas para WebP
- Redimensionar imagens antes do uso
- Evitar imagens maiores que o necessário

---

### Compression:

- Quality ideal:
  - 70–85 (lossy compression)
- Manter transparência quando necessário
- Remover metadados desnecessários

---

### Implementation:

Utilizar estrutura otimizada:

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" loading="lazy" alt="">
</picture>

---

### Loading:
-Sempre usar lazy loading:
-loading="lazy"
-Evitar carregamento desnecessário

---

### Best Practices:
-Preferir SVG para:
-ícones
-logos
-elementos UI

---

### Evitar:
-imagens muito grandes (ex: 4K desnecessário)
-uso excessivo de imagens

---

### VIDEO OPTIMIZATION (REQUIRED)
-Formats:
-Prioridade:
-MP4 (H.264)
-WebM

---

### Implementation:
<video autoplay muted loop playsinline preload="none">
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
</video>

---

### Compression Rules:
-Reduzir resolução:   Ideal: 480p – 720p
-Compressão:   CRF: 22–28
-Bitrate controlado
-Remover:
-áudio desnecessário
-Playback Optimization:
-Sempre usar:
-muted
-playsinline
-Evitar autoplay com áudio

---

### PERFORMANCE & SITE OPTIMIZATION (REQUIRED)
General Rules:
-Minimizar requisições HTTP
-Evitar arquivos grandes
-Usar assets otimizados

---

### FINAL RULE

-Sempre entregar o melhor equilíbrio entre qualidade visual e performance, priorizando carregamento rápido e experiência fluida