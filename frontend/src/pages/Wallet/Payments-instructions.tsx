import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Globe } from "lucide-react";

export default function PaymentInstructions() {
  return (
    <Card className=" grow-1 bg-white">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mtext-center">
          Payment Instructions
        </h2>

        <Accordion type="single" collapsible className="space-y-2">
          {/* M-PESA Accordion */}
          <AccordionItem value="mpesa" className="border rounded-lg px-2">
            <AccordionTrigger className="flex items-center gap-2">
              <span className="font-medium">M-PESA (PayBill)</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>
                <strong>1.</strong> Open the <b>M-PESA</b> menu on your phone.
              </p>
              <p>
                <strong>2.</strong> Select <b>Lipa na M-PESA → PayBill</b>.
              </p>
              <p>
                <strong>3.</strong> Enter the business number:
                <b className="text-foreground"> 123456</b>.
              </p>
              <p>
                <strong>4.</strong> Enter your account number 
              </p>
              <p>
                <strong>5.</strong> Enter the amount to pay and your M-PESA PIN.
              </p>
              <p>
                <strong>6.</strong> You’ll receive a confirmation SMS once the
                payment is successful.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* PayPal Accordion */}
          {/* <AccordionItem value="paypal" className="border rounded-lg px-2">
            <AccordionTrigger className="flex items-center gap-2">

              <span className="font-medium">PayPal</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>
                <strong>1.</strong> Click the <b>“Pay with PayPal”</b> button on
                the checkout page.
              </p>
              <p>
                <strong>2.</strong> You’ll be redirected to the secure PayPal
                payment portal.
              </p>
              <p>
                <strong>3.</strong> Log in with your PayPal account credentials.
              </p>
              <p>
                <strong>4.</strong> Review your payment details and confirm.
              </p>
              <p>
                <strong>5.</strong> Once complete, you’ll be redirected back to
                our site with your payment confirmation.
              </p>
            </AccordionContent>
          </AccordionItem> */}
        </Accordion>
      </CardContent>
    </Card>
  );
}
