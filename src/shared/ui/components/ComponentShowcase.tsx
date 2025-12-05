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
} from '@shared/ui/components';
import styles from './ComponentShowcase.module.css';

export const ComponentShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const selectOptions: SelectOption[] = [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
    { value: 'option3', label: 'Opción 3' },
  ];

  return (
    <div className={styles.container}>
      <h1>🎨 Design System - Componentes UI</h1>

      <section className={styles.section}>
        <h2>Buttons</h2>
        <div className={styles.row}>
          <Button variant="primary" onClick={() => alert('Primary clicked!')}>
            Primary Button
          </Button>
          <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
            Secondary Button
          </Button>
          <Button variant="primary" disabled>
            Disabled Button
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Input</h2>
        <Input
          id="test-input"
          name="test"
          label="Nombre"
          placeholder="Escribe tu nombre"
          value={inputValue}
          onChange={setInputValue}
          fullWidth
        />
        <Input
          id="error-input"
          name="error"
          label="With Error"
          placeholder="Input with error"
          value=""
          onChange={() => {}}
          error="This field is required"
          fullWidth
        />
      </section>

      <section className={styles.section}>
        <h2>Select</h2>
        <Select
          id="test-select"
          name="test"
          label="Select an option"
          options={selectOptions}
          value={selectValue}
          onChange={(value) => setSelectValue(String(value))}
          placeholder="Elige una opción"
          fullWidth
        />
      </section>

      <section className={styles.section}>
        <h2>Cards</h2>
        <div className={styles.row}>
          <Card>
            <h3>Card Normal</h3>
            <p>Este es un card básico sin hover.</p>
          </Card>
          <Card hoverable onClick={() => alert('Card clicked!')}>
            <h3>Card Hoverable</h3>
            <p>Este card tiene efecto hover y es clickeable.</p>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Spinner</h2>
        <div className={styles.row}>
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Badge</h2>
        <div className={styles.row}>
          <div className={styles.badgeDemo}>
            🛒 Cart
            <Badge count={5} variant="primary" />
          </div>
          <div className={styles.badgeDemo}>
            🔔 Notificaciones
            <Badge count={150} max={99} variant="secondary" />
          </div>
          <div className={styles.badgeDemo}>
            ✉️ Mensajes
            <Badge count={0} variant="primary" />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>ProductImage</h2>
        <div className={styles.row}>
          <ProductImage
            src="https://picsum.photos/200"
            alt="Sample product"
            size="small"
          />
          <ProductImage
            src="https://picsum.photos/400"
            alt="Sample product"
            size="medium"
          />
          <ProductImage
            src="invalid-url"
            alt="Image with error (fallback)"
            size="medium"
          />
        </div>
      </section>
    </div>
  );
};
