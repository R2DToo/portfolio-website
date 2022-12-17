import {
  Navbar,
  Text,
  Button,
  Link,
  Image,
  Switch,
  useTheme,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { SunIcon } from "./icons/SunIcon";
import { MoonIcon } from "./icons/MoonIcon";
// import { MyLogo } from "./MyLogo";

export default function NavBar() {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();

  return (
    <Navbar isBordered variant={"floating"}>
      <Navbar.Brand>
        <Image src={"/logo.png"} width={30} height={30} alt={""} />
        <Text b color="inherit" hideIn="xs">
          Still-Routley Development
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" enableCursorHighlight>
        <Navbar.Link isActive href="#">
          Projects
        </Navbar.Link>
        <Navbar.Link href="#">Skills</Navbar.Link>
        <Navbar.Link href="#">Home Server</Navbar.Link>
        <Navbar.Link href="#">Blog</Navbar.Link>
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Item>
          <Button auto flat as={Link} href="#">
            Contact Me
          </Button>
        </Navbar.Item>
        <Navbar.Item>
          <Switch
            checked={isDark}
            shadow={true}
            bordered={true}
            color="secondary"
            size="xl"
            iconOn={<MoonIcon filled />}
            iconOff={<SunIcon filled />}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
}
