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
  RadioGroup,
  QuantitySelector,
  Collapsible,
} from '@shared/ui/components';
import styles from './DesignSystemPage.module.css';

export const DesignSystemPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [radioValue, setRadioValue] = useState('red');
  const [radioSizeValue, setRadioSizeValue] = useState('m');
  const [quantity1, setQuantity1] = useState(1);
  const [quantity2, setQuantity2] = useState(3);
  const [quantity3, setQuantity3] = useState(1);
  const [quantity4, setQuantity4] = useState(50);

  const selectOptions: SelectOption[] = [
    { value: 'xs', label: 'Extra Small' },
    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ];

  const handleValidateInput = () => {
    if (inputValue.length < 3) {
      setInputError('Must have at least 3 characters');
    } else {
      setInputError('');
    }
  };

  return (
    <div className={styles.container}>
      <Header
        title="🎨 Design System"
        subtitle="Reusable UI component library built with React, TypeScript and CSS Modules"
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
            <p>Buttons with different variants and states</p>
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
            <h3>States</h3>
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
            <h3>Buttons with Icons</h3>
            <div className={styles.row}>
              <Button variant="primary" iconBefore="🚀">
                Icon before
              </Button>
              <Button variant="secondary" iconAfter="→">
                Icon after
              </Button>
              <Button variant="success" iconBefore="✓" iconAfter="→">
                Both icons
              </Button>
              <Button variant="outline" iconBefore="📦">
                Add to cart
              </Button>
              <Button variant="danger" iconAfter="🗑️">
                Delete
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
            <h3>With icons (simulated with emojis)</h3>
            <div className={styles.row}>
              <Button variant="primary">🛒 Add to cart</Button>
              <Button variant="secondary">❤️ Favorites</Button>
              <Button variant="primary">🔍 Search</Button>
            </div>
          </div>
        </section>

        {/* INPUTS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Input Fields</h2>
            <p>Text fields with validation and states</p>
          </div>

          <div className={styles.demo}>
            <h3>Basic Input</h3>
            <Input
              id="basic-input"
              name="basic"
              label="Name"
              placeholder="Enter your name"
              value={inputValue}
              onChange={setInputValue}
              fullWidth
            />
          </div>

          <div className={styles.demo}>
            <h3>Input with validation</h3>
            <Input
              id="validation-input"
              name="validation"
              label="Username (minimum 3 characters)"
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
              Validate
            </Button>
          </div>

          <div className={styles.demo}>
            <h3>Input types</h3>
            <div className={styles.column}>
              <Input
                id="email-input"
                name="email"
                type="email"
                label="Email"
                placeholder="your@email.com"
                value={emailValue}
                onChange={setEmailValue}
                fullWidth
              />
              <Input
                id="password-input"
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={passwordValue}
                onChange={setPasswordValue}
                fullWidth
              />
              <Input
                id="disabled-input"
                name="disabled"
                label="Disabled field"
                placeholder="Not editable"
                value="Fixed value"
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
            <p>Dropdown menus for selecting options</p>
          </div>

          <div className={styles.demo}>
            <h3>Basic Select</h3>
            <Select
              id="size-select"
              name="size"
              label="Select a size"
              options={selectOptions}
              value={selectValue}
              onChange={(value) => setSelectValue(String(value))}
              placeholder="Choose a size"
              fullWidth
            />
            {selectValue && (
              <p className={styles.resultText}>
                Selected size: <strong>{selectValue}</strong>
              </p>
            )}
          </div>

          <div className={styles.demo}>
            <h3>Disabled Select</h3>
            <Select
              id="disabled-select"
              name="disabled"
              label="Disabled select"
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
            <p>Containers for grouping related content</p>
          </div>

          <div className={styles.demo}>
            <h3>Basic Card</h3>
            <Card>
              <h4>Card Title</h4>
              <p>This is the content of a basic card without special effects.</p>
              <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                Ideal for displaying static information.
              </p>
            </Card>
          </div>

          <div className={styles.demo}>
            <h3>Card Variants</h3>
            <div className={styles.row}>
              <Card variant="default">
                <h4>Default</h4>
                <p>Standard card</p>
              </Card>
              <Card variant="primary">
                <h4>Primary</h4>
                <p>Featured card</p>
              </Card>
              <Card variant="secondary">
                <h4>Secondary</h4>
                <p>Secondary card</p>
              </Card>
              <Card variant="danger">
                <h4>Danger</h4>
                <p>Alert card</p>
              </Card>
              <Card variant="success">
                <h4>Success</h4>
                <p>Success card</p>
              </Card>
              <Card variant="warning">
                <h4>Warning</h4>
                <p>Warning card</p>
              </Card>
              <Card variant="outline">
                <h4>Outline</h4>
                <p>Card with border</p>
              </Card>
              <Card variant="dark">
                <h4>Dark</h4>
                <p>Dark card</p>
              </Card>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Hoverable Card</h3>
            <div className={styles.row}>
              <Card hoverable variant="primary" onClick={() => alert('Card 1 clicked!')}>
                <h4>🛍️ Product 1</h4>
                <p>Clickable card with hover effect</p>
                <p style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
                  €29.99
                </p>
              </Card>
              <Card hoverable variant="success" onClick={() => alert('Card 2 clicked!')}>
                <h4>🎁 Product 2</h4>
                <p>Clickable card with hover effect</p>
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
            <p>Loading indicators for asynchronous operations</p>
          </div>

          <div className={styles.demo}>
            <h3>Sizes</h3>
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
            <h3>Custom colors</h3>
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
            <p>Numeric indicators for counters and notifications</p>
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
            <h3>Counter limit (max)</h3>
            <div className={styles.row}>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>📦</span>
                <span>Products</span>
                <Badge count={150} max={99} variant="primary" />
              </div>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>⭐</span>
                <span>Favorites</span>
                <Badge count={1000} max={999} variant="secondary" />
              </div>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Hidden badge (count = 0)</h3>
            <div className={styles.row}>
              <div className={styles.badgeDemo}>
                <span className={styles.badgeIcon}>📬</span>
                <span>No messages</span>
                <Badge count={0} variant="primary" />
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT IMAGE */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Product Image</h2>
            <p>Specialized component for product images with lazy loading</p>
          </div>

          <div className={styles.demo}>
            <h3>Sizes</h3>
            <div className={styles.row}>
              <div className={styles.imageDemo}>
                <ProductImage
                  src="https://picsum.photos/200/200?random=1"
                  alt="Small product"
                  size="small"
                />
                <span>Small (80x80)</span>
              </div>
              <div className={styles.imageDemo}>
                <ProductImage
                  src="https://picsum.photos/200/200?random=2"
                  alt="Medium product"
                  size="medium"
                />
                <span>Medium (200x200)</span>
              </div>
              <div className={styles.imageDemo}>
                <ProductImage
                  src="https://picsum.photos/400/400?random=3"
                  alt="Large product"
                  size="large"
                />
                <span>Large (400x400)</span>
              </div>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Fallback (unavailable image)</h3>
            <div className={styles.row}>
              <div className={styles.imageDemo}>
                <ProductImage
                  src="invalid-url-that-will-fail.jpg"
                  alt="Image with error"
                  size="medium"
                />
                <span>Automatic placeholder</span>
              </div>
            </div>
          </div>
        </section>

        {/* COLOR PALETTE */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Color Palette</h2>
            <p>CSS variables of the design system</p>
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

        {/* RADIO GROUP */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Radio Group</h2>
            <p>Radio buttons for single selection from multiple options</p>
          </div>

          <div className={styles.demo}>
            <h3>Horizontal layout</h3>
            <RadioGroup
              name="color-horizontal"
              label="Select a color"
              options={[
                { value: 'red', label: 'Red' },
                { value: 'blue', label: 'Blue' },
                { value: 'green', label: 'Green' },
              ]}
              value={radioValue}
              onChange={(value) => setRadioValue(String(value))}
              layout="horizontal"
            />
          </div>

          <div className={styles.demo}>
            <h3>Vertical layout</h3>
            <RadioGroup
              name="size-vertical"
              label="Select a size"
              options={[
                { value: 's', label: 'Small' },
                { value: 'm', label: 'Medium' },
                { value: 'l', label: 'Large' },
                { value: 'xl', label: 'Extra Large' },
              ]}
              value={radioSizeValue}
              onChange={(value) => setRadioSizeValue(String(value))}
              layout="vertical"
            />
          </div>

          <div className={styles.demo}>
            <h3>Disabled state</h3>
            <RadioGroup
              name="color-disabled"
              label="Disabled radio group"
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
              ]}
              value="option1"
              onChange={() => {}}
              disabled
            />
          </div>
        </section>

        {/* QUANTITY SELECTOR */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Quantity Selector</h2>
            <p>Input for selecting numeric quantities with increment/decrement buttons</p>
          </div>

          <div className={styles.demo}>
            <h3>Basic quantity selector</h3>
            <QuantitySelector
              value={quantity1}
              min={1}
              max={10}
              onChange={setQuantity1}
            />
          </div>

          <div className={styles.demo}>
            <h3>With label</h3>
            <QuantitySelector
              label="Quantity"
              value={quantity2}
              min={1}
              max={99}
              onChange={setQuantity2}
            />
          </div>

          <div className={styles.demo}>
            <h3>Disabled state</h3>
            <QuantitySelector
              label="Quantity (disabled)"
              value={5}
              min={1}
              max={10}
              onChange={() => {}}
              disabled
            />
          </div>

          <div className={styles.demo}>
            <h3>Different limits</h3>
            <div className={styles.column}>
              <QuantitySelector
                label="Small range (1-5)"
                value={quantity3}
                min={1}
                max={5}
                onChange={setQuantity3}
              />
              <QuantitySelector
                label="Large range (0-100)"
                value={quantity4}
                min={0}
                max={100}
                onChange={setQuantity4}
              />
            </div>
          </div>
        </section>

        {/* COLLAPSIBLE */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Collapsible</h2>
            <p>Expandable/collapsible content sections</p>
          </div>

          <div className={styles.demo}>
            <h3>Basic collapsible</h3>
            <Collapsible title="Product Details">
              <p>This is the content inside the collapsible section.</p>
              <p>You can put any content here, including other components.</p>
            </Collapsible>
          </div>

          <div className={styles.demo}>
            <h3>Multiple collapsibles</h3>
            <div className={styles.column}>
              <Collapsible title="📦 Shipping Information">
                <p><strong>Standard Shipping:</strong> 5-7 business days</p>
                <p><strong>Express Shipping:</strong> 2-3 business days</p>
                <p><strong>Free shipping</strong> on orders over €50</p>
              </Collapsible>
              
              <Collapsible title="↩️ Return Policy">
                <p>Items can be returned within 30 days of purchase.</p>
                <p>Products must be in original condition with tags attached.</p>
                <Button variant="outline" onClick={() => alert('View full policy')}>
                  View Full Policy
                </Button>
              </Collapsible>

              <Collapsible title="💳 Payment Methods">
                <p>We accept the following payment methods:</p>
                <ul>
                  <li>Credit/Debit Cards (Visa, Mastercard, Amex)</li>
                  <li>PayPal</li>
                  <li>Bank Transfer</li>
                  <li>Apple Pay / Google Pay</li>
                </ul>
              </Collapsible>
            </div>
          </div>

          <div className={styles.demo}>
            <h3>Initially open</h3>
            <Collapsible title="FAQ: How do I track my order?" defaultOpen>
              <p>Once your order ships, you&apos;ll receive an email with a tracking number.</p>
              <p>You can also check your order status in your account dashboard.</p>
            </Collapsible>
          </div>
        </section>
      </div>
    </div>
  );
};
