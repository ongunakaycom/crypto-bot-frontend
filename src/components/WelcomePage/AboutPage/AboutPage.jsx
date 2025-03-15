import React, {useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useLocation for route-specific logic
import "./AboutPage.css";
import { Container, Row, Col, Button, Card, Carousel } from "react-bootstrap";
import { getAnalytics, logEvent } from "firebase/analytics";
import Footer from "../../Footer/Footer";
import WelcomePageHeader from "../WelcomePageHeader/WelcomePageHeader.jsx";

// Define the testimonials array
const testimonials = [
  {
    quote:
      "Aya is a game-changer! I've been on so many bad dates, but Aya finally found me someone I actually connect with.",
    user: "Sarah, Manchester",
  },
  {
    quote:
      "I was skeptical at first, but Aya really impressed me. She's like a friend who knows exactly what I'm looking for.",
    user: "John, Manchester",
  },
  {
    quote:
      "I'm so glad I gave Aya a try. I've been single for years, and now I'm finally in a happy relationship thanks to her.",
    user: "Emily, Hamburg",
  },
];

function AboutPage() {
  const analytics = getAnalytics();
  const navigate = useNavigate();

  useEffect(() => {
    logEvent(analytics, "about_page_visit");
  }, [analytics]);

  const handleSignUp = () => {
    navigate("/signup"); // Redirect to /signup
  };

  return (
    <div className="AboutPage">
      <WelcomePageHeader />
      <main>

      {/* How Aya Works Section */}
        <section
        id="how-aya-works"
        className="py-5 HowAyaBg"
        >
        <Container>
        <Row className="mb-4">
            <Col>
            <h2 className="display-4">How it works</h2>
            <p>
                Aya learns your values, dreams, and lifestyle to find compatible
                life partners through genuine conversations.
            </p>
            </Col>
        </Row>
        <Row>
            {[
            {
                title: "Like a Trusted Friend",
                text: "Aya gets to know you and your match, just like a close friend would, and sets you up with someone you'll really click with.",
            },
            {
                title: "No Digital Nonsense",
                text: "Skip the forms, creating profiles, swiping, and awkward online chats — Aya handles everything while you focus on getting to know your match in person.",
            },
            {
                title: "Ask Anything",
                text: "Aya fills you in on all the important details about your match before the date, just like a friend giving you a heads-up.",
            },
            {
                title: "Date Setup Included",
                text: "Aya organizes the date for you at a great local spot, with drinks or other fun extras included.",
            },
            {
                title: "Free Emotional Support",
                text: "Need advice on love? Aya is your personal Dr. Love, offering guidance and support at no charge.",
            },
            {
                title: "Post-Date Check-In",
                text: "Whether the date went great or not so well, Aya follows up with both of you to see how it went. She’ll help facilitate next steps if it’s a good match, and if it didn’t work out, she’ll learn and improve future matches.",
            },
            {
                title: "Always Save Face",
                text: "With Aya being an AI, you can be as quirky or as weird as you want without fear of judgment. Aya understands and supports you all the way.",
            },
            ].map((item, index) => (
            <Col xs={12} sm={6} md={4} className="d-flex" key={index}>
                <Card className="mb-4 flex-fill about-card">
                <Card.Body>
                    <Card.Title as="h3" className="about-card-title font-weight-bold">
                    {item.title}
                    </Card.Title>
                    <Card.Text className="about-card-text">{item.text}</Card.Text>
                </Card.Body>
                </Card>
            </Col>
            ))}
        </Row>
        </Container>
        </section>

        {/* Why Choose Aya Section */}
        <section className="py-5 WhyAyaBg">
        <Container>
        <Row className="mb-4">
            <Col>
            <h2 className="display-4">Why Aya?</h2>
            </Col>
        </Row>
        <Row>
            {[
            {
                title: "Personalized Matches",
                text: "Aya gets to know you deeply, finding matches who align with your values and personality—like how a good friend would pick someone for you.",
            },
            {
                title: "Say Goodbye to Digital Hassles",
                text: "No more filling out long profiles or endless chatting. Aya takes care of the legwork, so you can focus on making meaningful connections.",
            },
            {
                title: "Post-Date Support",
                text: " If you're shy or unsure after the date, Aya helps facilitate further steps. If it wasn’t a good match, she’ll improve her recommendations for future dates.",
            },
            {
                title: "No-Pressure Dates",
                text: " If you’re just looking for a fun, no-strings-attached date, Aya will match you with someone who has similar expectations, managing both sides from the start.",
            },
            {
                title: "Only Pay When You Go on a Date",
                text: " The setup, drinks, and more are included. You only pay when Aya successfully arranges a date for you.",
            }
            ].map((item, index) => (
              <Col xs={12} sm={6} md={4} className="d-flex" key={index}>
                  <Card className="mb-4 flex-fill about-card">
                  <Card.Body>
                      <Card.Title as="h3" className="about-card-title font-weight-bold">
                      {item.title}
                      </Card.Title>
                      <Card.Text className="about-card-text">{item.text}</Card.Text>
                  </Card.Body>
                  </Card>
              </Col>
              ))}
        </Row>
        </Container>
        </section>


        {/* Cities Section */}
        <section
          id="cities"
          className="py-5 citiesBg"
          style={{ backgroundColor: "#5d2f27", color: "white" }}
        >
          <Container>
          <Row className="mb-2">
            <Col>
              <h2 className="display-4">Where We Operate</h2>
              <p> Aya is currently available in the following cities:
              </p>
              </Col>
          </Row>
            
            {/* Current Cities */}
            <Row className="justify-content-center mb-3">
              <Col md={4}>
              <Card className="about-card">
                  <Card.Body>
                      <Card.Title as="h3" className="about-card-title font-weight-bold">
                      Current Cities
                      </Card.Title>
                      <Card.Text className="about-card-text">
                        <ul className="list-unstyled">
                        <li>Manchester</li>
                        <li>Hamburg</li>
                      </ul>
                    </Card.Text>
                  </Card.Body>
                  </Card>
              </Col>
            </Row>

            {/* Upcoming Cities */}
            
            <p>Coming soon to:</p>
            <Row className="justify-content-center mb-3">
              <Col md={4}>
                <Card className="about-card">
                  <Card.Body>
                    <Card.Title as="h3" className="about-card-title">Upcoming Cities</Card.Title>
                    <Card.Text className="about-card-text">
                      <ul className="list-unstyled">
                        <li>Tallin</li>
                        <li>Copenhagen</li>
                      </ul>
                    </Card.Text>                    
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Signup Call to Action */}
            <p className="mb-2">
              Not in any of these cities? No problem! Sign up now, and we’ll let you know as soon as Aya is available near you. In the meantime, Aya is still here to support you with love advice and emotional guidance at no cost.
            </p>

            {/* Global User Counter */}
            <div className="py-4">
              <h3 className="mb-4">
                Join Over 10,000 People Already Finding Meaningful Connections with Aya
              </h3>

              {/* Centered Button */}
              <div className="d-flex justify-content-center">
                <Button
                  className="w-75 border-light"
                  onClick={handleSignUp}
                >
                  Sign Up Now
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="WhyAyaBg py-5">
        <Container>
        <h3 className="mb-4">
            What People Are Saying
        </h3>
        <Carousel>
            {testimonials.map((item, index) => (
            <Carousel.Item key={index}>
                <blockquote
                className="mb-4"
                style={{ fontStyle: "italic", color: "#5d2f27" }}
                >
                <p>{item.quote}</p>
                <cite>{item.user}</cite>
                </blockquote>
            </Carousel.Item>
            ))}
        </Carousel>
        </Container>
        </section>

            
        </main>
      <Footer /> 
    </div>
  );
}

export default AboutPage;