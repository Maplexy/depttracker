# Color Palette Reference

## Unified Design System (Dark Mode)

### Primary Color
- **Name**: Emerald Green
- **HSL**: `hsl(150 90% 50%)`
- **Hex**: #10b981
- **Usage**: All primary actions, buttons, positive indicators, progress bars

### Background Colors
- **Background (Dark)**: `hsl(240 10% 3.9%)` (#09090b) - Zinc 950
- **Card (Dark)**: `hsl(240 10% 7%)` (#18181b) - Zinc 900
- **Muted (Dark)**: `hsl(240 3.7% 15.9%)` (#27272a) - Zinc 800
- **Border**: `hsl(240 3.7% 15.9%)` (#27272a)

### Text Colors
- **Foreground**: `hsl(0 0% 98%)` (#fafafa) - Zinc 50
- **Muted Foreground**: `hsl(240 5% 64.9%)` (#a1a1aa) - Zinc 400

### Accent Colors
- **Secondary**: `hsl(240 3.7% 15.9%)` (#27272a)
- **Destructive**: `hsl(0 62.8% 30.6%)` (#7f1d1d) - Rose 900
- **Destructive Foreground**: `hsl(0 0% 98%)` (#fafafa)

### Color Mappings
- **Primary Actions**: Green buttons, positive money values (+$XXX.XX)
- **Negative States**: Red for late payments, warnings
- **Neutral Elements**: Zinc grays for cards, borders, text

## Usage Examples

```tsx
// Primary Button (Emerald Green)
<Button className="bg-primary text-primary-foreground">
  Log Payment
</Button>

// Positive Money Value
<span className="text-primary text-2xl font-bold">
  +$1,250.00
</span>

// Negative Money Value
<span className="text-destructive text-2xl font-bold">
  -$50.00
</span>

// Progress Bar
<div className="h-2 w-full bg-muted rounded-full overflow-hidden">
  <div className="h-full bg-primary rounded-full" style={{ width: '62.5%' }} />
</div>

// Card Background
<Card className="bg-card border-border">
  <CardContent>...</CardContent>
</Card>
```

## Color Constants in CSS Variables

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 7%;
  --card-foreground: 0 0% 98%;
  --primary: 150 90% 50%;
  --primary-foreground: 220 10% 5%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 150 90% 50%;
  --radius: 0.5rem;
}
```

## Before & After Comparison

### Inconsistent Colors (Original HTML)
- Login: Primary #13ec92
- Modal: Primary #13ec80, Background #102219
- Dashboard: Primary #13ec5b, Background #09090b
- Sidebar: Primary #2b8cee (Blue!)

### Unified Colors (Solution)
- All Primary Actions: #10b981 (Emerald)
- All Backgrounds: #09090b (Dark Slate)
- All Cards: #18181b (Zinc)
- All Borders: #27272a (Zinc)
