export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img 
            src="/images/event-flex-logo.png" 
            alt="Logo" 
            className={`block h-12 w-auto ${className}`}
            {...props}
        />
    );
}
