import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  Select,
  SelectOption,
  Spinner,
  Badge,
  ProductImage,
  Header,
} from '@shared/ui/components';
import styles from './DesignSystemPage.module.css';

export const DesignSystemPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const selectOptions: SelectOption[] = [
    { value: 'xs', label: 'Extra Small' },
    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ];

  const handleValidateInput = () => {
    if (inputValue.length < 3) {
      setInputError('Debe tener al menos 3 caracteres');
    } else {
      setInputError('');
    }
  };

  return (
    <div className={styles.container}>
      <Header
        title="🎨 Design System"
        subtitle="Biblioteca de componentes UI reutilizables construidos con React, TypeScript y CSS Modules"
        showBackButton={true}
        backTo="/"
      >
        <Badge variant="success">v1.0.0</Badge>
      </Header>

      <div className={styles.content}>
        {/* BUTTONS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Buttons</h2>
            <p>Botones con diferentes variantes y estados</p>
          </div>
          
          <div className={styles.demo}>
            <h3>Variantes</h3>
            <div className={styles.row}>
              <Button variant="primary" onClick={() => alert('Primary clicked!')}>
                Primary
              </Button>
              <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
                Secondary
              </Button>
              <Button variant="danger" onClick={() => alert('Danger clicked!')}>
                Danger
              </Button>
              <Button variant="success" onClick={() => alert('Success clicked!')}>
                Success
              </Button>
              <Button variant="warning" onClick={() => alert('Warning clicked!')}>
                Warning
              </Button>
              <Button variant="outline" onClick={() => alert('Outline clicked!')}>
                Outline
              </Button>
              <Button variant="dark" onClick={() => alert('Dark clicked!')}>
                Dark
              </Button>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Estados</h3>
            <div className={styles.row}>
              <Button variant="primary">Enabled</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="secondary">Enabled</Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Botones con Iconos</h3>
            <div className={styles.row}>
              <Button variant="primary" iconBefore="🚀">
                Con icono antes
              </Button>
              <Button variant="secondary" iconAfter="→">
                Con icono después
              </Button>
              <Button variant="success" iconBefore="✓" iconAfter="→">
                Con ambos iconos
              </Button>
              <Button variant="outline" iconBefore="📦">
                Agregar al carrito
              </Button>
              <Button variant="danger" iconAfter="🗑️">
                Eliminar
              </Button>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Full Width</h3>
            <Button variant="primary" fullWidth>
              Full Width Button
            </Button>
          </div>

          <div className={styles.demo}>
            <h3>Con íconos (simulado con emojis)</h3>
            <div className={styles.row}>
              <Button variant="primary">🛒 Añadir al carrito</Button>
              <Button variant="secondary">❤️ Favoritos</Button>
              <Button variant="primary">🔍 Buscar</Button>
            </div>
          </div>
        </section>

        {/* INPUTS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Input Fields</h2>
            <p>Campos de texto con validación y estados</p>
          </div>

          <div className={styles.demo}>
            <h3>Input básico</h3>
            <Input
              id="basic-input"
              name="basic"
              label="Nombre"
              placeholder="Escribe tu nombre"
              value={inputValue}
              onChange={setInputValue}
              fullWidth
            />
          </div>

          <div className={styles.demo}>
            <h3>Input con validación</h3>
            <Input
              id="validation-input"
              name="validation"
              label="Username (mínimo 3 caracteres)"
              placeholder="username"
              value={inputValue}
              onChange={(val) => {
                setInputValue(val);
                setInputError('');
              }}
              error={inputError}
              fullWidth
            />
            <Button variant="secondary" onClick={handleValidateInput}>
              Validar
            </Button>
          </div>

          <div className={styles.demo}>
            <h3>Tipos de input</h3>
            <div className={styles.column}>
              <Input
                id="email-input"
                name="email"
                type="email"
                label="Email"
                placeholder="tu@email.com"
                value={emailValue}
                onChange={setEmailValue}
                fullWidth
              />
              <Input
                id="password-input"
                name="password"
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                value={passwordValue}
                onChange={setPasswordValue}
                fullWidth
              />
              <Input
                id="disabled-input"
                name="disabled"
                label="Campo deshabilitado"
                placeholder="No editable"
                value="Valor fijo"
                onChange={() => {}}
                disabled
                fullWidth
              />
            </div>
          </div>
        </section>

        {/* SELECT */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Select Dropdown</h2>
            <p>Menús desplegables para selección de opciones</p>
          </div>

          <div className={styles.demo}>
            <h3>Select básico</h3>
            <Select
              id="size-select"
              name="size"
              label="Selecciona una talla"
              options={selectOptions}
              value={selectValue}
              onChange={(value) => setSelectValue(String(value))}
              placeholder="Elige una talla"
              fullWidth
            />
            {selectValue && (
              <p className={styles.resultText}>
                Talla seleccionada: <strong>{selectValue}</strong>
              </p>
            )}
          </div>

          <div className={styles.demo}>
            <h3>Select deshabilitado</h3>
            <Select
              id="disabled-select"
              name="disabled"
              label="Select deshabilitado"
              options={selectOptions}
              value="m"
              onChange={() => {}}
              disabled
              fullWidth
            />
          </div>
        </section>

        {/* CARDS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Cards</h2>
            <p>Contenedores para agrupar contenido relacionado</p>
          </div>

          <div className={styles.demo}>
            <h3>Card básica</h3>
            <Card>
              <h4>Título de la Card</h4>
              <p>Este es el contenido de una card básica sin efectos especiales.</p>
              <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                Ideal para mostrar información estática.
              </p>
            </Card>
          </div>

          <div className={styles.demo}>
            <h3>Variantes de Cards</h3>
            <div className={styles.row}>
              <Card variant="default">
                <h4>Default</h4>
                <p>Card estándar</p>
              </Card>
              <Card variant="primary">
                <h4>Primary</h4>
                <p>Card destacada</p>
              </Card>
              <Card variant="secondary">
                <h4>Secondary</h4>
                <p>Card secundaria</p>
              </Card>
              <Card variant="danger">
                <h4>Danger</h4>
                <p>Card de alerta</p>
              </Card>
              <Card variant="success">
                <h4>Success</h4>
                <p>Card de éxito</p>
              </Card>
              <Card variant="warning">
                <h4>Warning</h4>
                <p>Card de advertencia</p>
              </Card>
              <Card variant="outline">
                <h4>Outline</h4>
                <p>Card con borde</p>
              </Card>
              <Card variant="dark">
                <h4>Dark</h4>
                <p>Card oscura</p>
              </Card>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Card con hover</h3>
            <div className={styles.row}>
              <Card hoverable variant="primary" onClick={() => alert('Card 1 clicked!')}>
                <h4>🛍️ Producto 1</h4>
                <p>Card clickeable con efecto hover</p>
                <p style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
                  €29.99
                </p>
              </Card>
              <Card hoverable variant="success" onClick={() => alert('Card 2 clicked!')}>
                <h4>🎁 Producto 2</h4>
                <p>Card clickeable con efecto hover</p>
                <p style={{ color: 'var(--color-success)', fontWeight: '500' }}>
                  €49.99
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* SPINNER */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Spinner (Loading)</h2>
            <p>Indicadores de carga para operaciones asíncronas</p>
          </div>

          <div className={styles.demo}>
            <h3>Tamaños</h3>
            <div className={styles.row}>
              <div className={styles.spinnerDemo}>
                <Spinner size="small" />
                <span>Small</span>
              </div>
              <div className={styles.spinnerDemo}>
                <Spinner size="medium" />
                <span>Medium</span>
              </div>
              <div className={styles.spinnerDemo}>
                <Spinner size="large" />
                <span>Large</span>
              </div>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Colores personalizados</h3>
            <div className={styles.row}>
              <div className={styles.spinnerDemo}>
                <Spinner size="medium" color="#007acc" />
                <span>Primary</span>
              </div>
              <div className={styles.spinnerDemo}>
                <Spinner size="medium" color="#d32f2f" />
                <span>Error</span>
              </div>
              <div className={styles.spinnerDemo}>
                <Spinner size="medium" color="#388e3c" />
                <span>Success</span>
              </div>
            </div>
          </div>
        </section>

        {/* BADGE */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Badge</h2>
            <p>Indicadores numéricos para contadores y notificaciones</p>
          </div>

          <div className={styles.demo}>
            <h3>Variantes</h3>
            <div className={styles.row}>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>🛒</span>
                <span>Primary</span>
                <Badge count={5} variant="primary" />
              </div>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>🔔</span>
                <span>Secondary</span>
                <Badge count={12} variant="secondary" />
              </div>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>❌</span>
                <span>Danger</span>
                <Badge count={3} variant="danger" />
              </div>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>✅</span>
                <span>Success</span>
                <Badge count={8} variant="success" />
              </div>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>⚠️</span>
                <span>Warning</span>
                <Badge count={15} variant="warning" />
              </div>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>⭕</span>
                <span>Outline</span>
                <Badge count={7} variant="outline" />
              </div>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>⚫</span>
                <span>Dark</span>
                <Badge count={9} variant="dark" />
              </div>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Límite de contador (max)</h3>
            <div className={styles.row}>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>📦</span>
                <span>Productos</span>
                <Badge count={150} max={99} variant="primary" />
              </div>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>⭐</span>
                <span>Favoritos</span>
                <Badge count={1000} max={999} variant="secondary" />
              </div>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Badge oculto (count = 0)</h3>
            <div className={styles.row}>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>📬</span>
                <span>Sin mensajes</span>
                <Badge count={0} variant="primary" />
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT IMAGE */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Product Image</h2>
            <p>Componente especializado para imágenes de productos con lazy loading</p>
          </div>

          <div className={styles.demo}>
            <h3>Tamaños</h3>
            <div className={styles.row}>
              <div className={styles.imageDemo}>
                <ProductImage
                  src="https://picsum.photos/200/200?random=1"
                  alt="Producto pequeño"
                  size="small"
                />
                <span>Small (80x80)</span>
              </div>
              <div className={styles.imageDemo}>
                <ProductImage
                  src="https://picsum.photos/200/200?random=2"
                  alt="Producto mediano"
                  size="medium"
                />
                <span>Medium (200x200)</span>
              </div>
              <div className={styles.imageDemo}>
                <ProductImage
                  src="https://picsum.photos/400/400?random=3"
                  alt="Producto grande"
                  size="large"
                />
                <span>Large (400x400)</span>
              </div>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Fallback (imagen no disponible)</h3>
            <div className={styles.row}>
              <div className={styles.imageDemo}>
                <ProductImage
                  src="invalid-url-that-will-fail.jpg"
                  alt="Imagen con error"
                  size="medium"
                />
                <span>Placeholder automático</span>
              </div>
            </div>
          </div>
        </section>

        {/* COLOR PALETTE */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Color Palette</h2>
            <p>Variables CSS del sistema de diseño</p>
          </div>

          <div className={styles.demo}>
            <div className={styles.colorGrid}>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#007acc' }} />
                <div className={styles.colorInfo}>
                  <strong>Primary</strong>
                  <code>#007acc</code>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#005a9e' }} />
                <div className={styles.colorInfo}>
                  <strong>Primary Dark</strong>
                  <code>#005a9e</code>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#d32f2f' }} />
                <div className={styles.colorInfo}>
                  <strong>Error</strong>
                  <code>#d32f2f</code>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#388e3c' }} />
                <div className={styles.colorInfo}>
                  <strong>Success</strong>
                  <code>#388e3c</code>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#f0f0f0' }} />
                <div className={styles.colorInfo}>
                  <strong>Secondary</strong>
                  <code>#f0f0f0</code>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#e0e0e0' }} />
                <div className={styles.colorInfo}>
                  <strong>Border</strong>
                  <code>#e0e0e0</code>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
