import Foundation
import UIKit
import Vision
import CoreImage
import React

/// Quita-fondos on-device usando Vision (subject lifting de Apple, iOS 17+).
/// Devuelve la ruta de un PNG con transparencia (fondo recortado).
@objc(BackgroundRemover)
class BackgroundRemover: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool { return false }

  @objc(removeBackground:resolver:rejecter:)
  func removeBackground(_ uri: String,
                        resolver resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    let path = uri.replacingOccurrences(of: "file://", with: "")
    guard let image = UIImage(contentsOfFile: path), let cgImage = image.cgImage else {
      reject("E_IMAGE", "No se pudo cargar la imagen.", nil)
      return
    }

    guard #available(iOS 17.0, *) else {
      reject("E_OS", "El quita-fondos requiere iOS 17 o superior.", nil)
      return
    }

    DispatchQueue.global(qos: .userInitiated).async {
      let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
      let request = VNGenerateForegroundInstanceMaskRequest()
      do {
        try handler.perform([request])
        guard let result = request.results?.first else {
          reject("E_NO_SUBJECT", "No se detectó ningún sujeto en la imagen.", nil)
          return
        }
        let maskedBuffer = try result.generateMaskedImage(
          ofInstances: result.allInstances,
          from: handler,
          croppedToInstancesExtent: true
        )
        let ciImage = CIImage(cvPixelBuffer: maskedBuffer)
        let context = CIContext()
        guard let outCG = context.createCGImage(ciImage, from: ciImage.extent) else {
          reject("E_RENDER", "No se pudo generar la imagen recortada.", nil)
          return
        }
        guard let png = UIImage(cgImage: outCG).pngData() else {
          reject("E_PNG", "No se pudo codificar el PNG.", nil)
          return
        }
        let outPath = (NSTemporaryDirectory() as NSString)
          .appendingPathComponent("eco5_cutout_\(UUID().uuidString).png")
        try png.write(to: URL(fileURLWithPath: outPath))
        resolve("file://" + outPath)
      } catch {
        reject("E_VISION", error.localizedDescription, error)
      }
    }
  }
}
