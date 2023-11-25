import { HeaderProps } from '../../types/header';

/**
 * Renders the header component with the specified title.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to be displayed in the header.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      </div>
    </header>
  );
}
