import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Zap,
  Rocket,
  TrendingUp,
  Users,
  BarChart3,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  ArrowRight,
  Star,
  Play,
  CheckCircle2,
  Wand2,
  Palette,
  Music2,
} from "lucide-react";

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Intersection Observer for scroll-triggered animations
      const elements = document.querySelectorAll(".scroll-animate");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementId = el.getAttribute("data-id");

        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
          setIsVisible((prev) => ({ ...prev, [elementId]: true }));
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const features = [
    {
      icon: <Wand2 className="h-6 w-6 text-white" />,
      title: "AI Caption Generation",
      description: "Gemini AI creates engaging, platform-optimized captions",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-50 to-pink-50",
    },
    {
      icon: <Palette className="h-6 w-6 text-white" />,
      title: "Smart Image Processing",
      description: "4 AI-powered filters for perfect visuals",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      icon: <Play className="h-6 w-6 text-white" />,
      title: "Video Generation",
      description: "Transform images into stunning animated videos",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
    {
      icon: <Music2 className="h-6 w-6 text-white" />,
      title: "Music Suggestions",
      description: "AI-curated music matching your content mood",
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-50 to-red-50",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      title: "Analytics Dashboard",
      description: "Track performance across all platforms",
      color: "from-violet-500 to-purple-500",
      gradient: "bg-gradient-to-br from-violet-50 to-purple-50",
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Multi-Platform",
      description: "Post to Instagram, Facebook, LinkedIn & Twitter",
      color: "from-pink-500 to-rose-500",
      gradient: "bg-gradient-to-br from-pink-50 to-rose-50",
    },
  ];

  const platforms = [
    {
      name: "Instagram",
      icon: <Instagram className="h-8 w-8" />,
      color: "text-pink-500",
      bg: "bg-pink-50",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-8 w-8" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-8 w-8" />,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-8 w-8" />,
      color: "text-sky-500",
      bg: "bg-sky-50",
    },
  ];

  const benefits = [
    "Generate perfect captions in seconds",
    "AI agents working simultaneously",
    "Professional image filters",
    "Automated video creation",
    "Smart music recommendations",
    "Multi-platform scheduling",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs with parallax effect */}
        <div
          className="absolute w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse"
          style={{
            top: "10%",
            left: "10%",
            transform: `translate(${
              mousePosition.x * 0.02 + scrollY * -0.3
            }px, ${mousePosition.y * 0.02 + scrollY * -0.2}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse"
          style={{
            top: "60%",
            right: "10%",
            animationDelay: "1s",
            transform: `translate(${
              mousePosition.x * -0.03 + scrollY * 0.2
            }px, ${mousePosition.y * -0.03 + scrollY * -0.15}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: "10%",
            left: "50%",
            animationDelay: "2s",
            transform: `translate(${
              mousePosition.x * 0.01 + scrollY * -0.1
            }px, ${mousePosition.y * 0.01 + scrollY * -0.25}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />

        {/* Floating particles with scroll effect */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `translateY(${scrollY * (0.1 + i * 0.05)}px)`,
              transition: "transform 0.1s linear",
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section with parallax */}
      <div
        className="relative z-10 container mx-auto px-4 pt-20 pb-32"
        id="hero"
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge with scale on scroll */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full mb-8 shadow-lg animate-fade-in hover:scale-105 transition-transform duration-300"
            style={{
              transform: `translateY(${scrollY * -0.1}px) scale(${
                1 - scrollY * 0.0002
              })`,
            }}
          >
            <Sparkles
              className="h-4 w-4 text-purple-600 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <span className="text-purple-900 text-sm font-semibold">
              Powered by Advanced AI Technology
            </span>
            <Star className="h-4 w-4 text-yellow-500 animate-pulse" />
          </div>

          {/* Main Heading with parallax */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-6 animate-fade-in-up leading-tight"
            style={{
              transform: `translateY(${scrollY * -0.3}px)`,
              opacity: 1 - scrollY * 0.002,
              transition: "transform 0.1s ease-out",
            }}
          >
            Create{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 blur-xl opacity-30" />
              <span className="relative bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Stunning
              </span>
            </span>{" "}
            <br className="hidden md:block" />
            Social Content
          </h1>

          {/* Subtitle with different parallax speed */}
          <p
            className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
            style={{
              transform: `translateY(${scrollY * -0.2}px)`,
              opacity: 1 - scrollY * 0.0015,
              animationDelay: "0.4s",
              transition: "transform 0.1s ease-out",
            }}
          >
            Harness the power of{" "}
            <span className="text-purple-600 font-bold">AI agents</span> working
            in parallel to transform your ideas into viral-worthy content in
            seconds
          </p>

          {/* CTA Buttons with hover lift effect */}
          {!isAuthenticated && (
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{
                transform: `translateY(${scrollY * -0.15}px)`,
                animationDelay: "0.6s",
                transition: "transform 0.1s ease-out",
              }}
            >
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="group px-10 py-7 text-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 rounded-xl"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="px-10 py-7 text-lg border-2 border-gray-300 text-gray-900 bg-white hover:bg-gray-50 hover:border-purple-400 hover:scale-105 hover:-translate-y-1 transition-all duration-300 rounded-xl shadow-md"
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Benefits List with staggered scroll animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`scroll-animate flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
                  isVisible[`benefit-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                data-id={`benefit-${index}`}
                style={{
                  transitionDelay: `${index * 0.1}s`,
                  animationDelay: `${0.8 + index * 0.1}s`,
                }}
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-sm font-medium text-gray-800">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div
            className="mt-16 animate-bounce cursor-pointer"
            onClick={() => scrollToSection("features")}
            style={{
              opacity: scrollY < 100 ? 1 : 0,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-purple-400 rounded-full animate-scroll" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with scroll animations */}
      <div
        className="relative z-10 py-24 bg-white/50 backdrop-blur-sm"
        id="features"
      >
        <div className="container mx-auto px-4">
          <div
            className={`scroll-animate text-center mb-16 ${
              isVisible["features-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            data-id="features-header"
            style={{ transition: "all 0.6s ease-out" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <Zap className="h-5 w-5 text-purple-600" />
              <span className="text-purple-900 font-semibold text-sm">
                Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powered by <span className="text-purple-600"> AI Agents</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Working simultaneously to create perfect content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`scroll-animate group relative p-8 ${
                  feature.gradient
                } border-2 border-white rounded-3xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer ${
                  isVisible[`feature-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
                data-id={`feature-${index}`}
                style={{
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                <div
                  className={`inline-flex p-4 bg-linear-to-r ${feature.color} rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platforms Section with rotation effect */}
      <div
        className="relative z-10 py-24 bg-linear-to-b from-white/50 to-purple-50/50"
        id="platforms"
      >
        <div className="container mx-auto px-4">
          <div
            className={`scroll-animate text-center mb-16 ${
              isVisible["platforms-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            data-id="platforms-header"
            style={{ transition: "all 0.6s ease-out" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full mb-4">
              <Users className="h-5 w-5 text-pink-600" />
              <span className="text-pink-900 font-semibold text-sm">
                Platforms
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Post Everywhere,{" "}
              <span className="text-pink-600">Manage Once</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Connect all your social media accounts in one place
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl mx-auto">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className={`scroll-animate group relative ${
                  isVisible[`platform-${index}`]
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-50"
                }`}
                data-id={`platform-${index}`}
                style={{
                  transitionDelay: `${index * 0.1}s`,
                  transition: "all 0.5s ease-out",
                }}
              >
                <div
                  className={`p-8 ${platform.bg} border-2 border-white rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-3 hover:rotate-6 cursor-pointer`}
                >
                  <div
                    className={`${platform.color} group-hover:scale-110 transition-transform`}
                  >
                    {platform.icon}
                  </div>
                </div>
                <p className="text-gray-900 text-sm font-bold text-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {platform.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with pulse effect */}
      {!isAuthenticated && (
        <div className="relative z-10 py-24" id="cta">
          <div className="container mx-auto px-4">
            <div
              className={`scroll-animate max-w-4xl mx-auto text-center p-12 bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl relative overflow-hidden shadow-2xl ${
                isVisible["cta"]
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90"
              }`}
              data-id="cta"
              style={{ transition: "all 0.6s ease-out" }}
            >
              <div className="absolute inset-0 bg-grid-white/10 bg-size-[20px_20px]" />

              <div className="relative z-10">
                <Rocket className="h-20 w-20 text-white mx-auto mb-6 animate-bounce" />
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Go Viral?
                </h2>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of creators using AI to boost their social
                  media presence
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate("/signup")}
                  className="px-12 py-7 text-lg bg-white text-purple-600 hover:bg-gray-100 shadow-2xl hover:scale-110 transition-all duration-300 rounded-xl font-bold"
                >
                  <span className="flex items-center gap-2">
                    Start Creating Now
                    <Sparkles className="h-5 w-5" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 py-12 border-t border-gray-200 bg-white/50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="font-semibold">
            © 2024 SocialBoost AI. Powered by advanced AI technology.
          </p>
          <p className="mt-2 text-sm">Made with ❤️ for creators everywhere</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }

        .scroll-animate {
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .bg-grid-white\/10 {
          background-image: linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};
