// Конфігурація HTML елементів з оригінальними тегами та базовими параметрами

export const HTML_ELEMENTS = {
  // Структурні елементи
  div: {
    tag: 'div',
    label: 'Div Container',
    icon: 'Square',
    description: 'Generic container',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      padding: '16px',
      margin: '0',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0',
      minHeight: '50px',
      width: 'auto',
      height: 'auto',
      position: 'static',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '0'
    },
    defaultContent: ''
  },

  section: {
    tag: 'section',
    label: 'Section',
    icon: 'Layout',
    description: 'Content section',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      padding: '24px',
      margin: '0 0 16px 0',
      backgroundColor: 'transparent',
      minHeight: '100px',
      width: 'auto',
      height: 'auto'
    },
    defaultContent: ''
  },

  nav: {
    tag: 'nav',
    label: 'Navigation',
    icon: 'Navigation',
    description: 'Navigation menu',
    canHaveChildren: true,
    defaultStyles: {
      display: 'flex',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      gap: '16px',
      alignItems: 'center',
      width: 'auto',
      height: 'auto'
    },
    defaultContent: ''
  },

  header: {
    tag: 'header',
    label: 'Header',
    icon: 'Layout',
    description: 'Page header',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      padding: '24px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e5e5ea',
      width: '100%',
      height: 'auto'
    },
    defaultContent: ''
  },

  footer: {
    tag: 'footer',
    label: 'Footer',
    icon: 'Layout',
    description: 'Page footer',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      padding: '24px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e5e5ea',
      width: '100%',
      height: 'auto'
    },
    defaultContent: ''
  },

  article: {
    tag: 'article',
    label: 'Article',
    icon: 'FileText',
    description: 'Article content',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      padding: '24px',
      margin: '0 0 16px 0',
      backgroundColor: 'transparent',
      width: 'auto',
      height: 'auto'
    },
    defaultContent: ''
  },

  aside: {
    tag: 'aside',
    label: 'Aside',
    icon: 'Layout',
    description: 'Sidebar content',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e5e5ea',
      borderRadius: '8px',
      width: '250px',
      height: 'auto'
    },
    defaultContent: ''
  },

  main: {
    tag: 'main',
    label: 'Main',
    icon: 'Layout',
    description: 'Main content',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      padding: '24px',
      width: '100%',
      height: 'auto'
    },
    defaultContent: ''
  },

  // Текстові елементи
  h1: {
    tag: 'h1',
    label: 'Heading 1',
    icon: 'Type',
    description: 'Main heading',
    canHaveChildren: false,
    defaultStyles: {
      display: 'block',
      fontSize: '32px',
      fontWeight: 'bold',
      margin: '0 0 16px 0',
      padding: '0',
      color: '#333333',
      lineHeight: '1.2',
      width: 'auto',
      height: 'auto'
    },
    defaultContent: 'Heading 1'
  },

  h2: {
    tag: 'h2',
    label: 'Heading 2',
    icon: 'Type',
    description: 'Secondary heading',
    canHaveChildren: false,
    defaultStyles: {
      display: 'block',
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0 0 12px 0',
      padding: '0',
      color: '#333333',
      lineHeight: '1.3',
      width: 'auto',
      height: 'auto'
    },
    defaultContent: 'Heading 2'
  },

  h3: {
    tag: 'h3',
    label: 'Heading 3',
    icon: 'Type',
    description: 'Third level heading',
    canHaveChildren: false,
    defaultStyles: {
      display: 'block',
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '0 0 10px 0',
      padding: '0',
      color: '#333333',
      lineHeight: '1.4',
      width: 'auto',
      height: 'auto'
    },
    defaultContent: 'Heading 3'
  },

  p: {
    tag: 'p',
    label: 'Paragraph',
    icon: 'Type',
    description: 'Text paragraph',
    canHaveChildren: false,
    defaultStyles: {
      display: 'block',
      padding: '0',
      margin: '0 0 16px 0',
      fontSize: '16px',
      lineHeight: '1.5',
      color: '#333333',
      width: 'auto',
      height: 'auto'
    },
    defaultContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },

  span: {
    tag: 'span',
    label: 'Span',
    icon: 'Type',
    description: 'Inline text',
    canHaveChildren: false,
    defaultStyles: {
      display: 'inline',
      fontSize: '16px',
      color: '#333333',
      padding: '0',
      margin: '0'
    },
    defaultContent: 'Inline text'
  },

  strong: {
    tag: 'strong',
    label: 'Strong',
    icon: 'Type',
    description: 'Bold text',
    canHaveChildren: false,
    defaultStyles: {
      display: 'inline',
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#333333'
    },
    defaultContent: 'Bold text'
  },

  em: {
    tag: 'em',
    label: 'Emphasis',
    icon: 'Type',
    description: 'Italic text',
    canHaveChildren: false,
    defaultStyles: {
      display: 'inline',
      fontStyle: 'italic',
      fontSize: '16px',
      color: '#333333'
    },
    defaultContent: 'Italic text'
  },

  // Інтерактивні елементи
  button: {
    tag: 'button',
    label: 'Button',
    icon: 'MousePointer',
    description: 'Interactive button',
    canHaveChildren: false,
    defaultStyles: {
      display: 'inline-block',
      padding: '12px 24px',
      margin: '0',
      backgroundColor: '#007AFF',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      width: 'auto',
      height: 'auto',
      textAlign: 'center'
    },
    defaultContent: 'Click me'
  },

  a: {
    tag: 'a',
    label: 'Link',
    icon: 'MousePointer',
    description: 'Hyperlink',
    canHaveChildren: false,
    defaultStyles: {
      display: 'inline',
      color: '#007AFF',
      textDecoration: 'underline',
      fontSize: '16px',
      cursor: 'pointer'
    },
    defaultContent: 'Link text',
    defaultAttributes: {
      href: '#'
    }
  },

  // Медіа елементи
  img: {
    tag: 'img',
    label: 'Image',
    icon: 'Image',
    description: 'Image element',
    canHaveChildren: false,
    defaultStyles: {
      display: 'block',
      width: '200px',
      height: '150px',
      objectFit: 'cover',
      border: 'none',
      borderRadius: '0'
    },
    defaultContent: 'https://picsum.photos/200/150',
    defaultAttributes: {
      alt: 'Image description'
    }
  },

  // Форми
  input: {
    tag: 'input',
    label: 'Input',
    icon: 'FormInput',
    description: 'Text input field',
    canHaveChildren: false,
    defaultStyles: {
      display: 'block',
      width: '200px',
      padding: '12px 16px',
      border: '1px solid #d1d1d6',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      color: '#333333'
    },
    defaultContent: 'placeholder text',
    defaultAttributes: {
      type: 'text'
    }
  },

  textarea: {
    tag: 'textarea',
    label: 'Textarea',
    icon: 'FormInput',
    description: 'Multi-line text input',
    canHaveChildren: false,
    defaultStyles: {
      display: 'block',
      width: '300px',
      height: '100px',
      padding: '12px 16px',
      border: '1px solid #d1d1d6',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      color: '#333333',
      resize: 'vertical'
    },
    defaultContent: 'Enter your text here...'
  },

  select: {
    tag: 'select',
    label: 'Select',
    icon: 'FormInput',
    description: 'Dropdown select',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      width: '200px',
      padding: '12px 16px',
      border: '1px solid #d1d1d6',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      color: '#333333'
    },
    defaultContent: ''
  },

  option: {
    tag: 'option',
    label: 'Option',
    icon: 'FormInput',
    description: 'Select option',
    canHaveChildren: false,
    defaultStyles: {
      display: 'block',
      padding: '8px',
      fontSize: '16px'
    },
    defaultContent: 'Option text'
  },

  // Списки
  ul: {
    tag: 'ul',
    label: 'Unordered List',
    icon: 'Layout',
    description: 'Bullet list',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      padding: '0',
      margin: '0 0 16px 24px',
      listStyle: 'disc',
      width: 'auto',
      height: 'auto'
    },
    defaultContent: ''
  },

  ol: {
    tag: 'ol',
    label: 'Ordered List',
    icon: 'Layout',
    description: 'Numbered list',
    canHaveChildren: true,
    defaultStyles: {
      display: 'block',
      padding: '0',
      margin: '0 0 16px 24px',
      listStyle: 'decimal',
      width: 'auto',
      height: 'auto'
    },
    defaultContent: ''
  },

  li: {
    tag: 'li',
    label: 'List Item',
    icon: 'Type',
    description: 'List item',
    canHaveChildren: false,
    defaultStyles: {
      display: 'list-item',
      padding: '4px 0',
      margin: '0',
      fontSize: '16px',
      color: '#333333'
    },
    defaultContent: 'List item'
  }
};

// Групування елементів для інтерфейсу
export const ELEMENT_GROUPS = {
  structure: {
    title: 'Структурні',
    elements: ['div', 'section', 'nav', 'header', 'footer', 'article', 'aside', 'main']
  },
  text: {
    title: 'Текстові',
    elements: ['h1', 'h2', 'h3', 'p', 'span', 'strong', 'em']
  },
  interactive: {
    title: 'Інтерактивні',
    elements: ['button', 'a']
  },
  media: {
    title: 'Медіа',
    elements: ['img']
  },
  forms: {
    title: 'Форми',
    elements: ['input', 'textarea', 'select', 'option']
  },
  lists: {
    title: 'Списки',
    elements: ['ul', 'ol', 'li']
  }
};