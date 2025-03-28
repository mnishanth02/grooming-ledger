import { Separator } from "../ui/separator";

const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto py-6">
        <Separator />
        <div className="pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} PwC Grooming Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
