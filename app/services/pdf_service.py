import io
import qrcode
from fpdf import FPDF


def generate_ticket_pdf(
    event_title: str,
    event_date: str,
    event_location: str,
    attendee_name: str,
    attendee_email: str,
    registration_code: str,
) -> io.BytesIO:
    """Generates a professional event ticket PDF and returns it as an in-memory byte buffer."""
    
    # Generate the QR Code in memory
    qr = qrcode.QRCode(
        version=1,
        box_size=8,
        border=2,
    )
    qr.add_data(registration_code)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")
    
    qr_buffer = io.BytesIO()
    qr_img.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)

    # Initialize FPDF
    pdf = FPDF(orientation="P", unit="mm", format="A5")
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()

    # Outer Ticket Border
    pdf.set_draw_color(99, 102, 241)  # Indigo
    pdf.set_line_width(0.8)
    pdf.rect(10, 10, 128, 190)

    # Header Banner
    pdf.set_fill_color(99, 102, 241)
    pdf.rect(10, 10, 128, 25, "F")
    
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_xy(10, 17)
    pdf.cell(128, 10, "EVENT PASS - ACCREDITATION", align="C")

    # Event Title
    pdf.set_text_color(30, 41, 59)
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_xy(15, 42)
    pdf.multi_cell(118, 7, event_title, align="C")

    # Divider line
    pdf.set_draw_color(226, 232, 240)
    pdf.set_line_width(0.4)
    pdf.line(15, 60, 133, 60)

    # Details Section
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(100, 116, 139)

    pdf.set_xy(15, 66)
    pdf.cell(35, 6, "ATTENDEE:")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(83, 6, attendee_name)

    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(100, 116, 139)
    pdf.set_xy(15, 74)
    pdf.cell(35, 6, "EMAIL:")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(83, 6, attendee_email)

    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(100, 116, 139)
    pdf.set_xy(15, 82)
    pdf.cell(35, 6, "DATE & TIME:")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(83, 6, event_date)

    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(100, 116, 139)
    pdf.set_xy(15, 90)
    pdf.cell(35, 6, "VENUE:")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.multi_cell(83, 6, event_location)

    # Embed QR Code
    qr_buffer.seek(0)
    pdf.image(qr_buffer, x=44, y=112, w=60, h=60)

    # Registration Code Text under QR
    pdf.set_font("Courier", "B", 10)
    pdf.set_text_color(71, 85, 105)
    pdf.set_xy(10, 175)
    pdf.cell(128, 6, f"CODE: {registration_code}", align="C")

    # Footer note
    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(148, 163, 184)
    pdf.set_xy(10, 185)
    pdf.cell(128, 5, "Please present this pass at the entrance check-in counter.", align="C")

    # Output to in-memory buffer
    pdf_buffer = io.BytesIO(pdf.output())
    pdf_buffer.seek(0)
    return pdf_buffer