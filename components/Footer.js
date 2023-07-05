export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-gray-200 p-4 text-center">
            <p className="text-gray-500">
                &copy; {currentYear} Apprecia. All rights reserved.
            </p>
        </footer>
    );
}
