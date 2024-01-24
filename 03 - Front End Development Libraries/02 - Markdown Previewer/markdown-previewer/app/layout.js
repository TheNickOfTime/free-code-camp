import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Markdown Previewer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <script src="https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js"></script>
      </body>
    </html>
  );
}
