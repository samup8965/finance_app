import {
  FaUniversity, // ATM
  FaFileInvoiceDollar, // BILL_PAYMENT
  FaCashRegister, // CASH
  FaGift, // CASHBACK
  FaFileSignature, // CHEQUE
  FaEdit, // CORRECTION
  FaPlusCircle, // CREDIT
  FaRedoAlt, // DIRECT_DEBIT
  FaChartLine, // DIVIDEND
  FaMoneyBillWave, // FEE_CHARGE
  FaPercentage, // INTEREST
  FaQuestionCircle, // OTHER
  FaShoppingCart, // PURCHASE
  FaSyncAlt, // STANDING_ORDER
  FaExchangeAlt, // TRANSFER
  FaMinusCircle, // DEBIT
  FaQuestion, // UNKNOWN
} from "react-icons/fa";

export const categoryIcons = {
  ATM: <FaUniversity className="text-blue-600" />,
  BILL_PAYMENT: <FaFileInvoiceDollar className="text-indigo-600" />,
  CASH: <FaCashRegister className="text-green-600" />,
  CASHBACK: <FaGift className="text-pink-600" />,
  CHEQUE: <FaFileSignature className="text-yellow-600" />,
  CORRECTION: <FaEdit className="text-red-600" />,
  CREDIT: <FaPlusCircle className="text-green-700" />,
  DIRECT_DEBIT: <FaRedoAlt className="text-purple-600" />,
  DIVIDEND: <FaChartLine className="text-teal-600" />,
  FEE_CHARGE: <FaMoneyBillWave className="text-red-500" />,
  INTEREST: <FaPercentage className="text-yellow-700" />,
  OTHER: <FaQuestionCircle className="text-gray-500" />,
  PURCHASE: <FaShoppingCart className="text-blue-500" />,
  STANDING_ORDER: <FaSyncAlt className="text-indigo-700" />,
  TRANSFER: <FaExchangeAlt className="text-purple-700" />,
  DEBIT: <FaMinusCircle className="text-red-700" />,
  UNKNOWN: <FaQuestion className="text-gray-400" />,
};
